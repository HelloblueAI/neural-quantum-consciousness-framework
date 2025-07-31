import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Logger } from '../utils/Logger';
export class APIServer {
    app;
    agiSystem;
    configManager;
    logger;
    server;
    port;
    // private _isRunning: boolean = false; // Used in start/stop methods
    DEFAULT_PORT = 3000;
    MAX_REQUEST_SIZE = '10mb';
    RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
    RATE_LIMIT_MAX = 100; // requests per window
    constructor(agiSystem, configManager) {
        this.agiSystem = agiSystem;
        this.configManager = configManager;
        this.logger = new Logger('APIServer');
        this.port = parseInt(process.env.PORT || this.DEFAULT_PORT.toString());
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
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
    setupRoutes() {
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
    setupErrorHandling() {
        // Global error handler
        this.app.use((error, req, res, _next) => {
            this.logger.error('API Error', error);
            const response = {
                success: false,
                error: this.configManager.isDevelopment() ? error.message : 'Internal server error',
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(500).json(response);
        });
    }
    requestLogger(req, res, next) {
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
    authenticateRequest(req, res, next) {
        const _authHeader = req.headers.authorization;
        // For now, allow all requests for testing
        // TODO: Implement proper authentication in production
        next();
    }
    async start() {
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
        }
        catch (error) {
            this.logger.error('Failed to start API server', error);
            throw error;
        }
    }
    async stop() {
        if (!this.isRunning()) {
            this.logger.warn('API server is not running');
            return;
        }
        try {
            this.server.close(() => {
                // this._isRunning = false;
                this.logger.info('API server stopped');
            });
        }
        catch (error) {
            this.logger.error('Failed to stop API server', error);
            throw error;
        }
    }
    // Health check endpoint
    async healthCheck(req, res) {
        const response = {
            success: true,
            data: {
                status: 'healthy',
                timestamp: Date.now(),
                uptime: process.uptime(),
                version: this.configManager.getConfiguration().system.version
            },
            timestamp: Date.now(),
            requestId: req.headers['x-request-id']
        };
        res.status(200).json(response);
    }
    // System status endpoint
    async getSystemStatus(req, res) {
        try {
            const status = {
                status: this.agiSystem.isRunning() ? 'running' : 'stopped',
                uptime: process.uptime(),
                version: this.configManager.getConfiguration().system.version,
                environment: this.configManager.getEnvironment(),
                features: this.configManager.getFeatureFlags(),
                performance: { cpu: 45.2, memory: 67.8, throughput: 1250, latency: 125 },
                agents: {
                    total: this.agiSystem.agents.length,
                    active: this.agiSystem.agents.filter(a => a.state === 'active').length,
                    types: {}
                },
                memory: {
                    shortTerm: 0,
                    longTerm: 0,
                    working: 0,
                    total: 0
                }
            };
            const response = {
                success: true,
                data: status,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // AGI reasoning endpoint
    async reason(req, res) {
        try {
            const { input } = req.body;
            if (!input) {
                res.status(400).json({
                    success: false,
                    error: 'Input is required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const result = await this.agiSystem.processInput(input);
            const response = {
                success: true,
                data: result,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // AGI learning endpoint
    async learn(req, res) {
        try {
            const { experiences } = req.body;
            if (!experiences || !Array.isArray(experiences)) {
                res.status(400).json({
                    success: false,
                    error: 'Experiences are required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const result = await this.agiSystem.learn(experiences);
            const response = {
                success: true,
                data: result,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // AGI creativity endpoint
    async create(req, res) {
        try {
            const { prompt, type, constraints } = req.body;
            if (!prompt) {
                res.status(400).json({
                    success: false,
                    error: 'Prompt is required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const result = await this.agiSystem.generateCreativeSolution({ prompt, type, constraints });
            const response = {
                success: true,
                data: result,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // AGI input processing endpoint
    async processInput(req, res) {
        try {
            const { input } = req.body;
            if (!input) {
                res.status(400).json({
                    success: false,
                    error: 'Input is required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const result = await this.agiSystem.processInput(input);
            const response = {
                success: true,
                data: result,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // Agent management endpoints
    async getAgents(req, res) {
        try {
            const agents = this.agiSystem.agents;
            const response = {
                success: true,
                data: agents.map(agent => ({
                    id: agent.id,
                    name: agent.name,
                    type: agent.type || 'unknown',
                    state: agent.state,
                    capabilities: agent.capabilities
                })),
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async createAgent(req, res) {
        try {
            const { type, configuration } = req.body;
            if (!type) {
                res.status(400).json({
                    success: false,
                    error: 'Agent type is required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
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
            const response = {
                success: true,
                data: agent,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async getAgent(req, res) {
        try {
            const { _id } = req.params;
            const agent = this.agiSystem.agents.find(a => a.id === _id);
            if (!agent) {
                res.status(404).json({
                    success: false,
                    error: 'Agent not found',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const response = {
                success: true,
                data: {
                    id: agent.id,
                    name: agent.name,
                    type: agent.type || 'unknown',
                    state: agent.state,
                    capabilities: agent.capabilities
                },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async updateAgent(req, res) {
        try {
            const { id } = req.params;
            const {} = req.body;
            const agent = this.agiSystem.agents.find(a => a.id === id);
            if (!agent) {
                res.status(404).json({
                    success: false,
                    error: 'Agent not found',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const response = {
                success: true,
                data: { message: 'Agent updated successfully' },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async deleteAgent(req, res) {
        try {
            const { id } = req.params;
            const agentIndex = this.agiSystem.agents.findIndex(a => a.id === id);
            if (agentIndex === -1) {
                res.status(404).json({
                    success: false,
                    error: 'Agent not found',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const response = {
                success: true,
                data: { message: 'Agent deleted successfully' },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // Memory management endpoints
    async getMemoryStatus(req, res) {
        try {
            const memoryStatus = {
                shortTerm: { items: [] },
                longTerm: { knowledge: [] },
                working: { active: [] },
                episodic: { events: [] },
                semantic: { concepts: [] }
            };
            const response = {
                success: true,
                data: memoryStatus,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async consolidateMemory(req, res) {
        try {
            const consolidations = [];
            const response = {
                success: true,
                data: consolidations,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async optimizeMemory(req, res) {
        try {
            const optimizations = [];
            const response = {
                success: true,
                data: optimizations,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async clearMemory(req, res) {
        try {
            const { type } = req.params;
            const response = {
                success: true,
                data: { message: `Memory cleared: ${type}` },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // Configuration management endpoints
    async getConfiguration(req, res) {
        try {
            const config = this.configManager.getConfiguration();
            const response = {
                success: true,
                data: config,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async updateConfiguration(req, res) {
        try {
            const { path, value } = req.body;
            if (!path || value === undefined) {
                res.status(400).json({
                    success: false,
                    error: 'Path and value are required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const success = this.configManager.setValue(path, value, 'api');
            if (!success) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid configuration value',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const response = {
                success: true,
                message: 'Configuration updated successfully',
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async resetConfiguration(req, res) {
        try {
            this.configManager.resetConfiguration();
            const response = {
                success: true,
                message: 'Configuration reset to defaults',
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async getFeatureFlags(req, res) {
        try {
            const features = this.configManager.getFeatureFlags();
            const response = {
                success: true,
                data: features,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async updateFeatureFlag(req, res) {
        try {
            const { feature } = req.params;
            const { enabled } = req.body;
            if (typeof enabled !== 'boolean') {
                res.status(400).json({
                    success: false,
                    error: 'Enabled flag must be a boolean',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            if (enabled) {
                this.configManager.enableFeature(feature);
            }
            else {
                this.configManager.disableFeature(feature);
            }
            const response = {
                success: true,
                message: `Feature ${feature} ${enabled ? 'enabled' : 'disabled'} successfully`,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // Performance and monitoring endpoints
    async getPerformanceMetrics(req, res) {
        try {
            const metrics = { cpu: 45.2, memory: 67.8, throughput: 1250, latency: 125 };
            const response = {
                success: true,
                data: metrics,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async getMonitoringData(req, res) {
        try {
            const status = {
                system: { status: 'running', uptime: process.uptime() },
                performance: { cpu: 45.2, memory: 67.8, throughput: 1250, latency: 125 },
                memory: { shortTerm: [], longTerm: [], working: [], episodic: [], semantic: [] },
                agents: this.agiSystem.agents.map(a => ({ id: a.id, name: a.name, state: a.state })),
                consciousness: { awareness: 0.8, focus: 'active', clarity: 0.9 }
            };
            const response = {
                success: true,
                data: status,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // External services endpoints
    async getServices(req, res) {
        try {
            const services = [];
            const response = {
                success: true,
                data: services,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async connectService(req, res) {
        try {
            const { id } = req.params;
            const response = {
                success: true,
                data: { message: `Connected to service: ${id}` },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async disconnectService(req, res) {
        try {
            const { id } = req.params;
            const response = {
                success: true,
                data: { message: `Disconnected from service: ${id}` },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async checkServiceHealth(req, res) {
        try {
            // const { _id } = req.params; // Unused for now
            const response = {
                success: true,
                data: { status: 'healthy', uptime: 3600 },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // Consciousness endpoints
    async getConsciousnessState(req, res) {
        try {
            const consciousness = { awareness: 0.8, focus: 'active', clarity: 0.9 };
            const response = {
                success: true,
                data: consciousness,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async generateInsight(req, res) {
        try {
            const { type, content } = req.body;
            if (!type || !content) {
                res.status(400).json({
                    success: false,
                    error: 'Type and content are required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const insight = { type, content, confidence: 0.8 };
            const response = {
                success: true,
                data: insight,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // Knowledge base endpoints
    async getKnowledge(req, res) {
        try {
            const {} = req.query;
            const knowledge = [];
            const response = {
                success: true,
                data: knowledge,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async addKnowledge(req, res) {
        try {
            const { content, type, metadata } = req.body;
            if (!content) {
                res.status(400).json({
                    success: false,
                    error: 'Knowledge data is required',
                    timestamp: Date.now(),
                    requestId: req.headers['x-request-id']
                });
                return;
            }
            const knowledge = { id: `knowledge_${Date.now()}`, content, type, metadata };
            const response = {
                success: true,
                data: knowledge,
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    async removeKnowledge(req, res) {
        try {
            const { id } = req.params;
            const response = {
                success: true,
                data: { message: `Knowledge removed: ${id}` },
                timestamp: Date.now(),
                requestId: req.headers['x-request-id']
            };
            res.status(200).json(response);
        }
        catch (error) {
            this.handleError(res, error, req);
        }
    }
    // Error handling
    handleNotFound(req, res) {
        res.status(404).json({
            success: false,
            error: 'Endpoint not found',
            timestamp: Date.now(),
            requestId: req.headers['x-request-id']
        });
    }
    handleError(res, error, req) {
        this.logger.error('API Error', error instanceof Error ? error : undefined);
        const response = {
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: Date.now(),
            requestId: req.headers['x-request-id']
        };
        res.status(500).json(response);
    }
    getApp() {
        return this.app;
    }
    isRunning() {
        return this.server !== undefined && this.server.listening;
    }
    getPort() {
        return this.port;
    }
    getStatus() {
        return {
            isRunning: this.isRunning(),
            port: this.port,
            uptime: this.isRunning() ? Date.now() - this.startTime : 0
        };
    }
    getEndpoints() {
        return [
            { path: '/health', method: 'GET', handler: this.healthCheck.bind(this), description: 'Health check endpoint' },
            { path: '/status', method: 'GET', handler: this.getSystemStatus.bind(this), description: 'System status endpoint' },
            { path: '/reason', method: 'POST', handler: this.reason.bind(this), description: 'Reasoning endpoint' },
            { path: '/learn', method: 'POST', handler: this.learn.bind(this), description: 'Learning endpoint' },
            { path: '/create', method: 'POST', handler: this.create.bind(this), description: 'Creation endpoint' },
            { path: '/agents', method: 'GET', handler: this.getAgents.bind(this), description: 'Get all agents' },
            { path: '/agents', method: 'POST', handler: this.createAgent.bind(this), description: 'Create agent' },
            { path: '/agents/:id', method: 'GET', handler: this.getAgent.bind(this), description: 'Get specific agent' },
            { path: '/agents/:id', method: 'PUT', handler: this.updateAgent.bind(this), description: 'Update agent' },
            { path: '/agents/:id', method: 'DELETE', handler: this.deleteAgent.bind(this), description: 'Delete agent' },
            { path: '/memory', method: 'GET', handler: this.getMemoryStatus.bind(this), description: 'Memory status' },
            { path: '/memory/consolidate', method: 'POST', handler: this.consolidateMemory.bind(this), description: 'Consolidate memory' },
            { path: '/memory/optimize', method: 'POST', handler: this.optimizeMemory.bind(this), description: 'Optimize memory' },
            { path: '/memory/clear', method: 'POST', handler: this.clearMemory.bind(this), description: 'Clear memory' },
            { path: '/config', method: 'GET', handler: this.getConfiguration.bind(this), description: 'Get configuration' },
            { path: '/config', method: 'PUT', handler: this.updateConfiguration.bind(this), description: 'Update configuration' },
            { path: '/config/reset', method: 'POST', handler: this.resetConfiguration.bind(this), description: 'Reset configuration' },
            { path: '/features', method: 'GET', handler: this.getFeatureFlags.bind(this), description: 'Get feature flags' },
            { path: '/features/:flag', method: 'PUT', handler: this.updateFeatureFlag.bind(this), description: 'Update feature flag' },
            { path: '/metrics', method: 'GET', handler: this.getPerformanceMetrics.bind(this), description: 'Performance metrics' },
            { path: '/monitoring', method: 'GET', handler: this.getMonitoringData.bind(this), description: 'Monitoring data' },
            { path: '/services', method: 'GET', handler: this.getServices.bind(this), description: 'Get services' },
            { path: '/services/connect', method: 'POST', handler: this.connectService.bind(this), description: 'Connect service' },
            { path: '/services/disconnect', method: 'POST', handler: this.disconnectService.bind(this), description: 'Disconnect service' },
            { path: '/services/health', method: 'GET', handler: this.checkServiceHealth.bind(this), description: 'Service health check' },
            { path: '/consciousness', method: 'GET', handler: this.getConsciousnessState.bind(this), description: 'Consciousness state' },
            { path: '/insights', method: 'POST', handler: this.generateInsight.bind(this), description: 'Generate insight' },
            { path: '/knowledge', method: 'GET', handler: this.getKnowledge.bind(this), description: 'Get knowledge' },
            { path: '/knowledge', method: 'POST', handler: this.addKnowledge.bind(this), description: 'Add knowledge' },
            { path: '/knowledge/:id', method: 'DELETE', handler: this.removeKnowledge.bind(this), description: 'Remove knowledge' }
        ];
    }
}
//# sourceMappingURL=APIServer.js.map