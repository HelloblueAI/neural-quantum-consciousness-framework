/**
 * Communication Protocol
 * Advanced inter-agent communication and external interface system
 */
import { EventEmitter } from 'events';
export declare class CommunicationProtocol extends EventEmitter {
    private readonly id;
    private readonly logger;
    private readonly config;
    private isRunning;
    private messageQueue;
    private connections;
    constructor(config: any);
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    sendMessage(target: string, message: any): Promise<void>;
    broadcastMessage(message: any): Promise<void>;
    getMetrics(): any;
    private initializeChannels;
    private initializeProtocol;
    private initializeHttpProtocol;
    private initializeWebSocketProtocol;
    private initializeGrpcProtocol;
    private setupMessageHandlers;
    private processMessage;
    private handleReasoningRequest;
    private handleLearningRequest;
    private handleActionRequest;
    private handleStatusRequest;
    private handleMessage;
    private handleConnection;
    private handleDisconnection;
}
//# sourceMappingURL=CommunicationProtocol.d.ts.map