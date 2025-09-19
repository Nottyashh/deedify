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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthWebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthWebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../common/prisma/prisma.service");
let AuthWebhooksController = AuthWebhooksController_1 = class AuthWebhooksController {
    constructor(authService, prisma) {
        this.authService = authService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(AuthWebhooksController_1.name);
    }
    async handleSupabaseWebhook(payload, authHeader) {
        if (!this.verifyWebhookSignature(authHeader, payload)) {
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        this.logger.log(`Received Supabase webhook: ${payload.type} on ${payload.table}`);
        try {
            switch (payload.type) {
                case 'INSERT':
                    await this.handleUserCreated(payload.record);
                    break;
                case 'UPDATE':
                    await this.handleUserUpdated(payload.record, payload.old_record);
                    break;
                case 'DELETE':
                    await this.handleUserDeleted(payload.record);
                    break;
                default:
                    this.logger.warn(`Unknown webhook type: ${payload.type}`);
            }
            return { success: true, message: 'Webhook processed successfully' };
        }
        catch (error) {
            this.logger.error('Failed to process webhook:', error);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    async handleUserCreated(record) {
        if (record.email) {
            await this.authService.verifySupabaseUser(record);
            this.logger.log(`User created from Supabase: ${record.email}`);
        }
    }
    async handleUserUpdated(record, oldRecord) {
        this.logger.log(`User updated in Supabase: ${record.email}`);
    }
    async handleUserDeleted(record) {
        this.logger.log(`User deleted in Supabase: ${record.email}`);
    }
    verifyWebhookSignature(authHeader, payload) {
        if (!authHeader) {
            return false;
        }
        return authHeader.startsWith('Bearer ');
    }
};
exports.AuthWebhooksController = AuthWebhooksController;
__decorate([
    (0, common_1.Post)('supabase'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Supabase auth webhooks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthWebhooksController.prototype, "handleSupabaseWebhook", null);
exports.AuthWebhooksController = AuthWebhooksController = AuthWebhooksController_1 = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth/webhooks'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], AuthWebhooksController);
//# sourceMappingURL=auth.webhooks.controller.js.map