"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get databaseUrl() {
        return this.configService.get('DATABASE_URL');
    }
    get supabaseUrl() {
        return this.configService.get('SUPABASE_URL');
    }
    get supabaseAnonKey() {
        return this.configService.get('SUPABASE_ANON_KEY');
    }
    get supabaseServiceRoleKey() {
        return this.configService.get('SUPABASE_SERVICE_ROLE');
    }
    get solanaCluster() {
        return this.configService.get('SOLANA_CLUSTER', 'devnet');
    }
    get heliusRpcUrl() {
        return this.configService.get('HELIUS_RPC_URL');
    }
    get mintAuthSecret() {
        return this.configService.get('MINT_AUTH_SECRET');
    }
    get metaplexAuthority() {
        return this.configService.get('METAPLEX_AUTHORITY');
    }
    get jwtSecret() {
        return this.configService.get('JWT_SECRET');
    }
    get port() {
        return this.configService.get('PORT', 3000);
    }
    get redisUrl() {
        return this.configService.get('REDIS_URL', 'redis://localhost:6379');
    }
    get kycProvider() {
        return this.configService.get('KYC_PROVIDER', 'veriff');
    }
    get kycApiKey() {
        return this.configService.get('KYC_API_KEY');
    }
    get stripeSecretKey() {
        return this.configService.get('STRIPE_SECRET_KEY');
    }
    get mapboxToken() {
        return this.configService.get('MAPBOX_TOKEN');
    }
    get valuationServiceUrl() {
        return this.configService.get('VALUATION_SERVICE_URL', 'http://localhost:3001');
    }
    get isDevelopment() {
        return this.configService.get('NODE_ENV') === 'development';
    }
    get isProduction() {
        return this.configService.get('NODE_ENV') === 'production';
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=config.service.js.map