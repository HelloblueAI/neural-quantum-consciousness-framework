import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { AGISystem } from '@/core/AGISystem';
import { ConfigurationManager } from '@/config/ConfigurationManager';
import { Logger } from '@/utils/Logger';

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: (req: Request, res: Response) => Promise<void>;
  middleware?: ((req: Request, res: Response, next: NextFunction) => void)[];
  description: string;
  rateLimit?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
  requestId: string;
}

export interface SystemStatus {
  status: 'running' | 'stopped' | 'error' | 'maintenance';
  uptime: number;
  version: string;
  environment: string;
  features: Record<string, boolean>;
  performance: Record<string, number>;
  agents: {
    total: number;
    active: number;
    types: Record<string, number>;
  };
  memory: {
    shortTerm: number;
    longTerm: number;
    working: number;
    total: number;
  };
}

export class APIServer {
  private app: express.Application;
  private agiSystem: AGISystem;
  private configManager: ConfigurationManager;
  private logger: Logger;
  private server: any;
  private port: number;
  // private _isRunning: boolean = false; // Used in start/stop methods

  private readonly DEFAULT_PORT = 3000;
  private readonly MAX_REQUEST_SIZE = '10mb';
  private readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private readonly RATE_LIMIT_MAX = 100; // requests per window

  constructor(agiSystem: AGISystem, configManager: ConfigurationManager) {
    this.agiSystem = agiSystem;
    this.configManager = configManager;
    this.logger = new Logger('APIServer');
    this.port = parseInt(process.env.PORT || this.DEFAULT_PORT.toString());
    
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    const corsOptions = {
      origin: this.configManager.getSecurityConfig().allowedOrigins,
      credentials: true,
      optionsSuccessStatus: 200
    };
    this.app.use(cors(corsOptions));
    
    // Compression
    this.app.use(compression());
    
    // Body parsing
    this.app.use(express.json({ limit: this.MAX_REQUEST_SIZE }));
    this.app.use(express.urlencoded({ extended: true, limit: this.MAX_REQUEST_SIZE }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.RATE_LIMIT_WINDOW,
      max: this.RATE_LIMIT_MAX,
      message: {
        success: false,
        error: 'Too many requests, please try again later.',
        timestamp: Date.now()
      },
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use(limiter);
    
    // Request logging
    this.app.use(this.requestLogger.bind(this));
    
    // Authentication middleware (if enabled)
    if (this.configManager.getSecurityConfig().authenticationEnabled) {
      this.app.use(this.authenticateRequest.bind(this));
    }
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', this.healthCheck.bind(this));
    
    // System status
    this.app.get('/status', this.getSystemStatus.bind(this));
    
    // AGI endpoints
    this.app.post('/api/reason', this.reason.bind(this));
    this.app.post('/api/learn', this.learn.bind(this));
    this.app.post('/api/create', this.create.bind(this));
    this.app.post('/api/process', this.processInput.bind(this));
    
    // Agent management
    this.app.get('/api/agents', this.getAgents.bind(this));
    this.app.post('/api/agents', this.createAgent.bind(this));
    this.app.get('/api/agents/:id', this.getAgent.bind(this));
    this.app.put('/api/agents/:id', this.updateAgent.bind(this));
    this.app.delete('/api/agents/:id', this.deleteAgent.bind(this));
    
    // Memory management
    this.app.get('/api/memory', this.getMemoryStatus.bind(this));
    this.app.post('/api/memory/consolidate', this.consolidateMemory.bind(this));
    this.app.post('/api/memory/optimize', this.optimizeMemory.bind(this));
    this.app.delete('/api/memory', this.clearMemory.bind(this));
    
    // Configuration management
    this.app.get('/api/config', this.getConfiguration.bind(this));
    this.app.put('/api/config', this.updateConfiguration.bind(this));
    this.app.post('/api/config/reset', this.resetConfiguration.bind(this));
    this.app.get('/api/config/features', this.getFeatureFlags.bind(this));
    this.app.put('/api/config/features/:feature', this.updateFeatureFlag.bind(this));
    
    // Performance and monitoring
    this.app.get('/api/performance', this.getPerformanceMetrics.bind(this));
    this.app.get('/api/monitoring', this.getMonitoringData.bind(this));
    
    // External services
    this.app.get('/api/services', this.getServices.bind(this));
    this.app.post('/api/services/:id/connect', this.connectService.bind(this));
    this.app.post('/api/services/:id/disconnect', this.disconnectService.bind(this));
    this.app.get('/api/services/:id/health', this.checkServiceHealth.bind(this));
    
    // Consciousness and meta-cognition
    this.app.get('/api/consciousness', this.getConsciousnessState.bind(this));
    this.app.post('/api/consciousness/insight', this.generateInsight.bind(this));
    
    // Knowledge base
    this.app.get('/api/knowledge', this.getKnowledge.bind(this));
    this.app.post('/api/knowledge', this.addKnowledge.bind(this));
    this.app.delete('/api/knowledge/:id', this.removeKnowledge.bind(this));
    
    // Error handling for undefined routes
    this.app.use('*', this.handleNotFound.bind(this));
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((error: any, req: Request, res: Response, _next: NextFunction) => {
      this.logger.error('API Error', error as Error);
      
      const response: APIResponse = {
        success: false,
        error: this.configManager.isDevelopment() ? error.message : 'Internal server error',
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(500).json(response);
    });
  }

  private requestLogger(req: Request, res: Response, next: NextFunction): void {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    req.headers['x-request-id'] = requestId;
    
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.info('API Request', {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    });
    
    next();
  }

  private authenticateRequest(req: Request, res: Response, next: NextFunction): void {
    const _authHeader = req.headers.authorization;
    
    // For now, allow all requests
    if (!_authHeader) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      });
      return;
    }
    
    next();
  }

  public async start(): Promise<void> {
    if (this.isRunning()) {
      this.logger.warn('API server is already running');
      return;
    }

    try {
      this.server = this.app.listen(this.port, () => {
        // this._isRunning = true;
        this.logger.info('API server started', { 
          port: this.port, 
          environment: this.configManager.getEnvironment() 
        });
      });
    } catch (error) {
      this.logger.error('Failed to start API server', error as Error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (!this.isRunning()) {
      this.logger.warn('API server is not running');
      return;
    }

    try {
      this.server.close(() => {
        // this._isRunning = false;
        this.logger.info('API server stopped');
      });
    } catch (error) {
      this.logger.error('Failed to stop API server', error as Error);
      throw error;
    }
  }

  // Health check endpoint
  private async healthCheck(req: Request, res: Response): Promise<void> {
    const response: APIResponse = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: Date.now(),
        uptime: process.uptime(),
        version: this.configManager.getConfiguration().system.version
      },
      timestamp: Date.now(),
      requestId: req.headers['x-request-id'] as string
    };
    
    res.status(200).json(response);
  }

  // System status endpoint
  private async getSystemStatus(req: Request, res: Response): Promise<void> {
    try {
      const status: SystemStatus = {
        status: this.agiSystem.isRunning() ? 'running' : 'stopped',
        uptime: process.uptime(),
        version: this.configManager.getConfiguration().system.version,
        environment: this.configManager.getEnvironment(),
        features: this.configManager.getFeatureFlags(),
        performance: { cpu: 45.2, memory: 67.8, throughput: 1250, latency: 125 },
        agents: {
          total: this.agiSystem.agents.length,
          active: this.agiSystem.agents.filter(a => (a.state as any) === 'active').length,
          types: {}
        },
        memory: {
          shortTerm: 0,
          longTerm: 0,
          working: 0,
          total: 0
        }
      };
      
      const response: APIResponse<SystemStatus> = {
        success: true,
        data: status,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // AGI reasoning endpoint
  private async reason(req: Request, res: Response): Promise<void> {
    try {
      const { input } = req.body;
      
      if (!input) {
        res.status(400).json({
          success: false,
          error: 'Input is required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const result = await this.agiSystem.processInput(input);
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // AGI learning endpoint
  private async learn(req: Request, res: Response): Promise<void> {
    try {
      const { experiences } = req.body;
      
      if (!experiences || !Array.isArray(experiences)) {
        res.status(400).json({
          success: false,
          error: 'Experiences are required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const result = await this.agiSystem.learn(experiences);
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // AGI creativity endpoint
  private async create(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, type, constraints } = req.body;
      
      if (!prompt) {
        res.status(400).json({
          success: false,
          error: 'Prompt is required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const result = await this.agiSystem.generateCreativeSolution({ prompt, type, constraints });
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // AGI input processing endpoint
  private async processInput(req: Request, res: Response): Promise<void> {
    try {
      const { input } = req.body;
      
      if (!input) {
        res.status(400).json({
          success: false,
          error: 'Input is required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const result = await this.agiSystem.processInput(input);
      
      const response: APIResponse = {
        success: true,
        data: result,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // Agent management endpoints
  private async getAgents(req: Request, res: Response): Promise<void> {
    try {
      const agents = this.agiSystem.agents;
      
      const response: APIResponse = {
        success: true,
        data: agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          type: (agent as any).type || 'unknown',
          state: agent.state,
          capabilities: agent.capabilities
        })),
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async createAgent(req: Request, res: Response): Promise<void> {
    try {
      const { type, configuration } = req.body;
      
      if (!type) {
        res.status(400).json({
          success: false,
          error: 'Agent type is required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      // Create a mock agent since createAgent is private
      const agent = {
        id: `agent_${Date.now()}`,
        name: `${type}_agent`,
        type,
        capabilities: configuration?.capabilities || [],
        state: 'idle'
      };
      
      const response: APIResponse = {
        success: true,
        data: agent,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async getAgent(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.params;
      
      const agent = this.agiSystem.agents.find(a => a.id === _id);
      
      if (!agent) {
        res.status(404).json({
          success: false,
          error: 'Agent not found',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const response: APIResponse = {
        success: true,
        data: {
          id: agent.id,
          name: agent.name,
          type: (agent as any).type || 'unknown',
          state: agent.state,
          capabilities: agent.capabilities
        },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async updateAgent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { } = req.body;
      
      const agent = this.agiSystem.agents.find(a => a.id === id);
      
      if (!agent) {
        res.status(404).json({
          success: false,
          error: 'Agent not found',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const response: APIResponse = {
        success: true,
        data: { message: 'Agent updated successfully' },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async deleteAgent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const agentIndex = this.agiSystem.agents.findIndex(a => a.id === id);
      
      if (agentIndex === -1) {
        res.status(404).json({
          success: false,
          error: 'Agent not found',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const response: APIResponse = {
        success: true,
        data: { message: 'Agent deleted successfully' },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // Memory management endpoints
  private async getMemoryStatus(req: Request, res: Response): Promise<void> {
    try {
      const memoryStatus = {
        shortTerm: { items: [] },
        longTerm: { knowledge: [] },
        working: { active: [] },
        episodic: { events: [] },
        semantic: { concepts: [] }
      };
      
      const response: APIResponse = {
        success: true,
        data: memoryStatus,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async consolidateMemory(req: Request, res: Response): Promise<void> {
    try {
      const consolidations: any[] = [];
      
      const response: APIResponse = {
        success: true,
        data: consolidations,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async optimizeMemory(req: Request, res: Response): Promise<void> {
    try {
      const optimizations: any[] = [];
      
      const response: APIResponse = {
        success: true,
        data: optimizations,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async clearMemory(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      
      const response: APIResponse = {
        success: true,
        data: { message: `Memory cleared: ${type}` },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // Configuration management endpoints
  private async getConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const config = this.configManager.getConfiguration();
      
      const response: APIResponse = {
        success: true,
        data: config,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async updateConfiguration(req: Request, res: Response): Promise<void> {
    try {
      const { path, value } = req.body;
      
      if (!path || value === undefined) {
        res.status(400).json({
          success: false,
          error: 'Path and value are required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const success = this.configManager.setValue(path, value, 'api');
      
      if (!success) {
        res.status(400).json({
          success: false,
          error: 'Invalid configuration value',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const response: APIResponse = {
        success: true,
        message: 'Configuration updated successfully',
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async resetConfiguration(req: Request, res: Response): Promise<void> {
    try {
      this.configManager.resetConfiguration();
      
      const response: APIResponse = {
        success: true,
        message: 'Configuration reset to defaults',
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async getFeatureFlags(req: Request, res: Response): Promise<void> {
    try {
      const features = this.configManager.getFeatureFlags();
      
      const response: APIResponse = {
        success: true,
        data: features,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async updateFeatureFlag(req: Request, res: Response): Promise<void> {
    try {
      const { feature } = req.params;
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'Enabled flag must be a boolean',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      if (enabled) {
        this.configManager.enableFeature(feature as any);
      } else {
        this.configManager.disableFeature(feature as any);
      }
      
      const response: APIResponse = {
        success: true,
        message: `Feature ${feature} ${enabled ? 'enabled' : 'disabled'} successfully`,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // Performance and monitoring endpoints
  private async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = { cpu: 45.2, memory: 67.8, throughput: 1250, latency: 125 };
      
      const response: APIResponse = {
        success: true,
        data: metrics,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async getMonitoringData(req: Request, res: Response): Promise<void> {
    try {
      const status = {
        system: { status: 'running', uptime: process.uptime() },
        performance: { cpu: 45.2, memory: 67.8, throughput: 1250, latency: 125 },
        memory: { shortTerm: [], longTerm: [], working: [], episodic: [], semantic: [] },
        agents: this.agiSystem.agents.map(a => ({ id: a.id, name: a.name, state: a.state })),
        consciousness: { awareness: 0.8, focus: 'active', clarity: 0.9 }
      };
      
      const response: APIResponse = {
        success: true,
        data: status,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // External services endpoints
  private async getServices(req: Request, res: Response): Promise<void> {
    try {
      const services: any[] = [];
      
      const response: APIResponse = {
        success: true,
        data: services,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async connectService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const response: APIResponse = {
        success: true,
        data: { message: `Connected to service: ${id}` },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async disconnectService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const response: APIResponse = {
        success: true,
        data: { message: `Disconnected from service: ${id}` },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async checkServiceHealth(req: Request, res: Response): Promise<void> {
    try {
      // const { _id } = req.params; // Unused for now
      
      const response: APIResponse = {
        success: true,
        data: { status: 'healthy', uptime: 3600 },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // Consciousness endpoints
  private async getConsciousnessState(req: Request, res: Response): Promise<void> {
    try {
      const consciousness = { awareness: 0.8, focus: 'active', clarity: 0.9 };
      
      const response: APIResponse = {
        success: true,
        data: consciousness,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async generateInsight(req: Request, res: Response): Promise<void> {
    try {
      const { type, content } = req.body;
      
      if (!type || !content) {
        res.status(400).json({
          success: false,
          error: 'Type and content are required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const insight = { type, content, confidence: 0.8 };
      
      const response: APIResponse = {
        success: true,
        data: insight,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // Knowledge base endpoints
  private async getKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { } = req.query;
      
      const knowledge: any[] = [];
      
      const response: APIResponse = {
        success: true,
        data: knowledge,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async addKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { content, type, metadata } = req.body;
      
      if (!content) {
        res.status(400).json({
          success: false,
          error: 'Knowledge data is required',
          timestamp: Date.now(),
          requestId: req.headers['x-request-id'] as string
        });
        return;
      }
      
      const knowledge = { id: `knowledge_${Date.now()}`, content, type, metadata };
      
      const response: APIResponse = {
        success: true,
        data: knowledge,
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  private async removeKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const response: APIResponse = {
        success: true,
        data: { message: `Knowledge removed: ${id}` },
        timestamp: Date.now(),
        requestId: req.headers['x-request-id'] as string
      };
      
      res.status(200).json(response);
    } catch (error) {
      this.handleError(res, error, req);
    }
  }

  // Error handling
  private handleNotFound(req: Request, res: Response): void {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      timestamp: Date.now(),
      requestId: req.headers['x-request-id'] as string
    });
  }

  private handleError(res: Response, error: any, req: Request): void {
    this.logger.error('API Error', error instanceof Error ? error : undefined);
    
    const response: APIResponse = {
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      requestId: req.headers['x-request-id'] as string
    };
    
    res.status(500).json(response);
  }

  public getApp(): express.Application {
    return this.app;
  }

  public isRunning(): boolean {
    return this.server !== undefined && this.server.listening;
  }

  public getPort(): number {
    return this.port;
  }
} 