import { ConfigService as NestConfigService } from '@nestjs/config';
export declare class AppConfigService {
    private configService;
    constructor(configService: NestConfigService);
    get databaseUrl(): string;
    get supabaseUrl(): string;
    get supabaseAnonKey(): string;
    get supabaseServiceRoleKey(): string;
    get solanaCluster(): string;
    get heliusRpcUrl(): string;
    get mintAuthSecret(): string;
    get metaplexAuthority(): string;
    get jwtSecret(): string;
    get port(): number;
    get redisUrl(): string;
    get kycProvider(): string;
    get kycApiKey(): string;
    get stripeSecretKey(): string;
    get mapboxToken(): string;
    get valuationServiceUrl(): string;
    get isDevelopment(): boolean;
    get isProduction(): boolean;
}
