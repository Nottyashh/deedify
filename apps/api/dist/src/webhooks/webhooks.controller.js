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
var WebhooksController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhooks_service_1 = require("./webhooks.service");
let WebhooksController = WebhooksController_1 = class WebhooksController {
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
        this.logger = new common_1.Logger(WebhooksController_1.name);
    }
    async handleHeliusWebhook(payload, authHeader) {
        if (!this.verifyHeliusSignature(authHeader, payload)) {
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        this.logger.log(`Received Helius webhook: ${payload.type} - ${payload.signature}`);
        try {
            await this.webhooksService.processHeliusWebhook(payload);
            return { success: true, message: 'Webhook processed successfully' };
        }
        catch (error) {
            this.logger.error('Failed to process Helius webhook:', error);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    async handleKycWebhook(payload, authHeader) {
        if (!this.verifyKycSignature(authHeader, payload)) {
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        this.logger.log(`Received KYC webhook: ${payload.event} - ${payload.verification_id}`);
        try {
            await this.webhooksService.processKycWebhook(payload);
            return { success: true, message: 'Webhook processed successfully' };
        }
        catch (error) {
            this.logger.error('Failed to process KYC webhook:', error);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    async handleStripeWebhook(payload, signature) {
        if (!this.verifyStripeSignature(signature, payload)) {
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        this.logger.log(`Received Stripe webhook: ${payload.type}`);
        try {
            await this.webhooksService.processStripeWebhook(payload);
            return { success: true, message: 'Webhook processed successfully' };
        }
        catch (error) {
            this.logger.error('Failed to process Stripe webhook:', error);
            throw new common_1.BadRequestException('Failed to process webhook');
        }
    }
    verifyHeliusSignature(authHeader, payload) {
        if (!authHeader) {
            return false;
        }
        return authHeader.startsWith('Bearer ');
    }
    verifyKycSignature(authHeader, payload) {
        if (!authHeader) {
            return false;
        }
        return authHeader.startsWith('Bearer ');
    }
    verifyStripeSignature(signature, payload) {
        if (!signature) {
            return false;
        }
        return signature.startsWith('t=');
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('helius'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Helius webhooks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleHeliusWebhook", null);
__decorate([
    (0, common_1.Post)('kyc'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Handle KYC webhooks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleKycWebhook", null);
__decorate([
    (0, common_1.Post)('stripe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Stripe webhooks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid webhook payload' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "handleStripeWebhook", null);
exports.WebhooksController = WebhooksController = WebhooksController_1 = __decorate([
    (0, swagger_1.ApiTags)('webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map