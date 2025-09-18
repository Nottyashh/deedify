import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get supabaseUrl(): string {
    return this.configService.get<string>('SUPABASE_URL');
  }

  get supabaseAnonKey(): string {
    return this.configService.get<string>('SUPABASE_ANON_KEY');
  }

  get supabaseServiceRoleKey(): string {
    return this.configService.get<string>('SUPABASE_SERVICE_ROLE');
  }

  get solanaCluster(): string {
    return this.configService.get<string>('SOLANA_CLUSTER', 'devnet');
  }

  get heliusRpcUrl(): string {
    return this.configService.get<string>('HELIUS_RPC_URL');
  }

  get mintAuthSecret(): string {
    return this.configService.get<string>('MINT_AUTH_SECRET');
  }

  get metaplexAuthority(): string {
    return this.configService.get<string>('METAPLEX_AUTHORITY');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
  }

  get kycProvider(): string {
    return this.configService.get<string>('KYC_PROVIDER', 'veriff');
  }

  get kycApiKey(): string {
    return this.configService.get<string>('KYC_API_KEY');
  }

  get stripeSecretKey(): string {
    return this.configService.get<string>('STRIPE_SECRET_KEY');
  }

  get mapboxToken(): string {
    return this.configService.get<string>('MAPBOX_TOKEN');
  }

  get valuationServiceUrl(): string {
    return this.configService.get<string>('VALUATION_SERVICE_URL', 'http://localhost:3001');
  }

  get isDevelopment(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'development';
  }

  get isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }
}