/**
 * Performance Monitor
 * Comprehensive performance monitoring and optimization system
 */
import { EventEmitter } from 'events';
export declare class PerformanceMonitor extends EventEmitter {
    private readonly id;
    private readonly logger;
    private isRunning;
    private metrics;
    private history;
    private startTime;
    constructor();
    start(): void;
    stop(): void;
    recordMetric(name: string, value: number): void;
    getMetrics(): any;
    analyze(): Promise<any>;
    private analyzeTrends;
    private identifyBottlenecks;
    private generateRecommendations;
    private calculateEfficiency;
    private calculateTrend;
    private calculateResourceTrends;
}
//# sourceMappingURL=PerformanceMonitor.d.ts.map