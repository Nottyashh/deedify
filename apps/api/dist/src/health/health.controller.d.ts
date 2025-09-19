import { PrismaService } from '../common/prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        version: string;
    }>;
    getVersion(): Promise<{
        version: string;
        nodeVersion: string;
        platform: NodeJS.Platform;
        arch: NodeJS.Architecture;
        timestamp: string;
    }>;
    getDatabaseHealth(): Promise<{
        status: string;
        database: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        database: string;
        error: any;
        timestamp: string;
    }>;
    getReadiness(): Promise<{
        status: string;
        checks: {
            database: string;
        };
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        checks: {
            database: string;
        };
        error: any;
        timestamp: string;
    }>;
}
