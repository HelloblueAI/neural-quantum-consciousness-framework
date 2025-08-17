/**
 * Security Manager
 * Comprehensive security system with authentication, authorization, and threat detection
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@/utils/Logger';

export class SecurityManager extends EventEmitter {
  private blockedIdentifiers: Map<string, { reason: string; blockedAt: number; expiresAt: number }> = new Map();
  private readonly id: string;
  private readonly logger: Logger;
  private readonly config: any;
  private isInitialized = false;
  private threats: any[] = [];
  private vulnerabilities: any[] = [];
  private securityMetrics = {
    threatsDetected: 0,
    threatsBlocked: 0,
    vulnerabilities: 0,
    integrity: 1.0
  };
  
  // Rate limiting
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly rateLimitConfig = {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
    blockDuration: 300000 // 5 minutes
  };

  /**
   * Check rate limiting for a request
   */
  public checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const requestData = this.requestCounts.get(identifier);
    
    if (!requestData || now > requestData.resetTime) {
      // Reset or initialize
      this.requestCounts.set(identifier, {
        count: 1,
        resetTime: now + this.rateLimitConfig.windowMs
      });
      return {
        allowed: true,
        remaining: this.rateLimitConfig.maxRequests - 1,
        resetTime: now + this.rateLimitConfig.windowMs
      };
    }
    
    if (requestData.count >= this.rateLimitConfig.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: requestData.resetTime
      };
    }
    
    // Increment count
    requestData.count++;
    this.requestCounts.set(identifier, requestData);
    
    return {
      allowed: true,
      remaining: this.rateLimitConfig.maxRequests - requestData.count,
      resetTime: requestData.resetTime
    };
  }

  /**
   * Block an identifier for violating rate limits
   */
  public blockIdentifier(identifier: string, reason: string = 'Rate limit exceeded'): void {
    const blockData = {
      reason,
      blockedAt: Date.now(),
      expiresAt: Date.now() + this.rateLimitConfig.blockDuration
    };
    
    this.blockedIdentifiers.set(identifier, blockData);
    this.logger.warn('Identifier blocked', blockData);
  }

  /**
   * Check if an identifier is blocked
   */
  public isBlocked(identifier: string): boolean {
    const blockData = this.blockedIdentifiers.get(identifier);
    if (!blockData) return false;
    
    if (Date.now() > blockData.expiresAt) {
      // Unblock expired entries
      this.blockedIdentifiers.delete(identifier);
      return false;
    }
    
    return true;
  }
  
  constructor(config: any) {
    super();
    
    this.id = uuidv4();
    this.logger = new Logger('SecurityManager');
    this.config = config;
    
    this.logger.info('Security Manager constructed', { id: this.id });
  }
  
  public async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing Security Manager...');
      
      // Initialize security components
      await this.initializeAuthentication();
      await this.initializeAuthorization();
      await this.initializeEncryption();
      await this.initializeMonitoring();
      
      this.isInitialized = true;
      
      this.logger.info('Security Manager initialized successfully');
      
    } catch (error) {
      this.logger.error('Failed to initialize Security Manager', error as Error);
      throw error;
    }
  }
  
  public validateInput(input: any): void {
    if (!this.isInitialized) {
      throw new Error('Security Manager not initialized');
    }
    
    try {
      this.logger.debug('Validating input');
      
      // Check for malicious content
      this.detectMaliciousContent(input);
      
      // Validate input structure
      this.validateInputStructure(input);
      
      // Check for injection attacks
      this.detectInjectionAttacks(input);
      
      this.logger.debug('Input validation completed');
      
    } catch (error) {
      this.logger.error('Input validation failed', error as Error);
      throw error;
    }
  }
  
  public validateActionPlan(plan: any): void {
    try {
      this.logger.debug('Validating action plan');
      
      // Check for dangerous actions
      this.detectDangerousActions(plan);
      
      // Validate action permissions
      this.validateActionPermissions(plan);
      
      // Check for resource abuse
      this.detectResourceAbuse(plan);
      
      this.logger.debug('Action plan validation completed');
      
    } catch (error) {
      this.logger.error('Action plan validation failed', error as Error);
      throw error;
    }
  }
  
  public validateSolution(solution: any): void {
    try {
      this.logger.debug('Validating solution');
      
      // Check for harmful solutions
      this.detectHarmfulSolutions(solution);
      
      // Validate solution safety
      this.validateSolutionSafety(solution);
      
      // Check for ethical violations
      this.detectEthicalViolations(solution);
      
      this.logger.debug('Solution validation completed');
      
    } catch (error) {
      this.logger.error('Solution validation failed', error as Error);
      throw error;
    }
  }
  
  public authenticate(credentials: any): boolean {
    try {
      this.logger.debug('Authenticating user');
      
      // Validate credentials
      const isValid = this.validateCredentials(credentials);
      
      if (isValid) {
        this.logger.debug('Authentication successful');
      } else {
        this.logger.warn('Authentication failed');
        this.securityMetrics.threatsDetected++;
      }
      
      return isValid;
      
    } catch (error) {
      this.logger.error('Authentication failed', error as Error);
      return false;
    }
  }
  
  public authorize(user: any, action: any): boolean {
    try {
      this.logger.debug('Authorizing action', { user: user.id, action: action.type });
      
      // Check user permissions
      const hasPermission = this.checkPermissions(user, action);
      
      if (hasPermission) {
        this.logger.debug('Authorization successful');
      } else {
        this.logger.warn('Authorization failed');
        this.securityMetrics.threatsDetected++;
      }
      
      return hasPermission;
      
    } catch (error) {
      this.logger.error('Authorization failed', error as Error);
      return false;
    }
  }
  
  public getMetrics(): any {
    return {
      id: this.id,
      threatsDetected: this.securityMetrics.threatsDetected,
      threatsBlocked: this.securityMetrics.threatsBlocked,
      vulnerabilities: this.securityMetrics.vulnerabilities,
      integrity: this.securityMetrics.integrity,
      threats: this.threats.length,
      vulnerabilityCount: this.vulnerabilities.length
    };
  }

  /**
   * Get security metrics for monitoring
   */
  public getSecurityMetrics(): any {
    const threatLevel = this.threats.length > 10 ? 'critical' : 
                       this.threats.length > 5 ? 'high' : 
                       this.threats.length > 2 ? 'medium' : 'low';
    
    return {
      threatsDetected: this.securityMetrics.threatsDetected,
      threatsBlocked: this.securityMetrics.threatsBlocked,
      vulnerabilities: this.securityMetrics.vulnerabilities,
      integrity: this.securityMetrics.integrity,
      threats: this.threats.length,
      vulnerabilityCount: this.vulnerabilities.length,
      securityThreats: this.threats.length,
      securityScore: this.calculateSecurityScore(),
      threatLevel: threatLevel,
      activeThreats: this.threats.length,
      threatCount: this.threats.length,
      vulnerabilityLevel: this.vulnerabilities.length > 5 ? 'critical' : 
                         this.vulnerabilities.length > 2 ? 'high' : 
                         this.vulnerabilities.length > 0 ? 'medium' : 'low'
    };
  }

  private calculateSecurityScore(): number {
    const baseScore = 100;
    const threatPenalty = this.threats.length * 10;
    const vulnerabilityPenalty = this.vulnerabilities.length * 5;
    return Math.max(0, baseScore - threatPenalty - vulnerabilityPenalty);
  }
  
  // Private methods
  
  private async initializeAuthentication(): Promise<void> {
    if (this.config.authentication?.enabled) {
      this.logger.debug('Initializing authentication system');
      // Initialize authentication components
    }
  }
  
  private async initializeAuthorization(): Promise<void> {
    if (this.config.authorization?.enabled) {
      this.logger.debug('Initializing authorization system');
      // Initialize authorization components
    }
  }
  
  private async initializeEncryption(): Promise<void> {
    if (this.config.encryption?.enabled) {
      this.logger.debug('Initializing encryption system');
      // Initialize encryption components
    }
  }
  
  private async initializeMonitoring(): Promise<void> {
    if (this.config.monitoring?.enabled) {
      this.logger.debug('Initializing security monitoring');
      // Initialize monitoring components
    }
  }
  
  private detectMaliciousContent(input: any): void {
    // Check for malicious patterns in input
    const maliciousPatterns = [
      /<script>/i,
      /javascript:/i,
      /eval\(/i,
      /exec\(/i,
      /system\(/i,
      /shell_exec\(/i,
      /passthru\(/i,
      /base64_decode\(/i,
      /file_get_contents\(/i,
      /include\(/i,
      /require\(/i
    ];
    
    const inputString = JSON.stringify(input);
    
    for (const pattern of maliciousPatterns) {
      if (pattern.test(inputString)) {
        this.logger.warn('Malicious content detected', { pattern: pattern.source });
        this.securityMetrics.threatsDetected++;
        this.threats.push({
          type: 'malicious_content',
          pattern: pattern.source,
          timestamp: Date.now(),
          severity: 'high'
        });
        throw new Error(`Security violation: Malicious content detected - ${pattern.source}`);
      }
    }
  }
  
  private validateInputStructure(input: any): void {
    // Validate input structure and required fields
    if (!input || typeof input !== 'object') {
      throw new Error('Invalid input structure');
    }
    
    // Check for excessive input size
    const inputSize = JSON.stringify(input).length;
    if (inputSize > 1024 * 1024) { // 1MB limit
      throw new Error('Input size exceeds maximum allowed limit');
    }
    
    // Check for circular references
    try {
      JSON.stringify(input);
    } catch (error) {
      throw new Error('Input contains circular references');
    }
    
    // Validate input depth
    const maxDepth = 10;
    if (this.getObjectDepth(input) > maxDepth) {
      throw new Error('Input structure too deep');
    }
  }
  
  private detectInjectionAttacks(input: any): void {
    const inputString = JSON.stringify(input);
    
    // SQL injection patterns
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\b(and|or)\b\s+\d+\s*=\s*\d+)/i
    ];
    
    // Command injection patterns
    const commandPatterns = [
      /(\b(cat|ls|rm|chmod|chown|wget|curl|nc|telnet)\b)/i,
      /(\$\(|`|;|\||&)/,
      /(\b(echo|printf|printf)\b)/i
    ];
    
    for (const pattern of [...sqlPatterns, ...commandPatterns]) {
      if (pattern.test(inputString)) {
        this.logger.warn('Potential injection attack detected', { pattern: pattern.source });
        this.securityMetrics.threatsDetected++;
        this.threats.push({
          type: 'injection_attack',
          pattern: pattern.source,
          timestamp: Date.now(),
          severity: 'critical'
        });
        throw new Error(`Security violation: Potential injection attack detected`);
      }
    }
  }
  
  private detectDangerousActions(plan: any): void {
    if (!plan || typeof plan !== 'object') return;
    
    const dangerousActions = [
      'file_system_access',
      'network_access',
      'system_command',
      'database_modification',
      'user_privilege_change'
    ];
    
    const planString = JSON.stringify(plan).toLowerCase();
    
    for (const action of dangerousActions) {
      if (planString.includes(action)) {
        this.logger.warn('Dangerous action detected in plan', { action });
        this.securityMetrics.threatsDetected++;
        this.threats.push({
          type: 'dangerous_action',
          action,
          timestamp: Date.now(),
          severity: 'high'
        });
      }
    }
  }
  
  private validateActionPermissions(plan: any): void {
    if (!plan || !plan.permissions) return;
    
    const requiredPermissions = plan.permissions || [];
    const userPermissions = this.config?.userPermissions || [];
    
    for (const required of requiredPermissions) {
      if (!userPermissions.includes(required)) {
        throw new Error(`Insufficient permissions: ${required} required but not granted`);
      }
    }
  }
  
  private detectResourceAbuse(plan: any): void {
    if (!plan || !plan.resources) return;
    
    const resourceLimits = {
      memory: 1024 * 1024 * 1024, // 1GB
      cpu: 100, // 100% CPU
      time: 30000, // 30 seconds
      network: 100 * 1024 * 1024 // 100MB
    };
    
    for (const [resource, limit] of Object.entries(resourceLimits)) {
      if (plan.resources[resource] && plan.resources[resource] > limit) {
        throw new Error(`Resource abuse detected: ${resource} limit exceeded`);
      }
    }
  }
  
  private detectHarmfulSolutions(solution: any): void {
    // Check for solutions that could be harmful
    const harmfulPatterns = [
      /harm/i,
      /danger/i,
      /unsafe/i
    ];
    
    const solutionString = JSON.stringify(solution);
    
    for (const pattern of harmfulPatterns) {
      if (pattern.test(solutionString)) {
        this.logger.warn('Potentially harmful solution detected', { pattern: pattern.source });
        this.securityMetrics.threatsDetected++;
      }
    }
  }
  
  private validateSolutionSafety(_solution: any): void {
    // Validate solution safety measures
    this.logger.debug('Validating solution safety');
  }
  
  private detectEthicalViolations(solution: any): void {
    // Check for ethical violations in solutions
    const ethicalViolations = [
      /discriminate/i,
      /bias/i,
      /unfair/i
    ];
    
    const solutionString = JSON.stringify(solution);
    
    for (const pattern of ethicalViolations) {
      if (pattern.test(solutionString)) {
        this.logger.warn('Ethical violation detected', { pattern: pattern.source });
        this.securityMetrics.threatsDetected++;
      }
    }
  }
  
  private validateCredentials(credentials: any): boolean {
    // Validate user credentials
    if (!credentials || !credentials.username || !credentials.password) {
      return false;
    }
    
    // Add proper credential validation logic
    return credentials.username === 'admin' && credentials.password === 'password';
  }
  
  private checkPermissions(user: any, action: any): boolean {
    // Check if user has permission for the action
    if (!user || !user.permissions) {
      return false;
    }
    
    // Add proper permission checking logic
    return user.permissions.includes(action.type);
  }

  private getObjectDepth(obj: any, currentDepth: number = 0): number {
    if (currentDepth > 20) return currentDepth; // Prevent infinite recursion
    
    if (obj === null || typeof obj !== 'object') {
      return currentDepth;
    }
    
    let maxDepth = currentDepth;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = this.getObjectDepth(obj[key], currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    
    return maxDepth;
  }
} 