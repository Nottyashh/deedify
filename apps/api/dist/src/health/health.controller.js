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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../common/prisma/prisma.service");
let HealthController = class HealthController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
        };
    }
    async getVersion() {
        return {
            version: process.env.npm_package_version || '1.0.0',
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            timestamp: new Date().toISOString(),
        };
    }
    async getDatabaseHealth() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                database: 'disconnected',
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async getReadiness() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'ready',
                checks: {
                    database: 'ok',
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                status: 'not ready',
                checks: {
                    database: 'failed',
                },
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('version'),
    (0, swagger_1.ApiOperation)({ summary: 'Get service version' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Version information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getVersion", null);
__decorate([
    (0, common_1.Get)('database'),
    (0, swagger_1.ApiOperation)({ summary: 'Database health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Database is healthy' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Database is unhealthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getDatabaseHealth", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is ready' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service is not ready' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getReadiness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map