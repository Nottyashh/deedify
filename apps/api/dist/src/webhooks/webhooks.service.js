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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(prisma, solanaService) {
        this.prisma = prisma;
        this.solanaService = solanaService;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async processHeliusWebhook(payload) {
        this.logger.log(`Processing Helius webhook: ${payload.type}`);
        try {
            switch (payload.type) {
                case 'TRANSFER':
                    await this.handleNftTransfer(payload);
                    break;
                case 'NFT_SALE':
                    await this.handleNftSale(payload);
                    break;
                case 'NFT_MINT':
                    await this.handleNftMint(payload);
                    break;
                case 'NFT_BURN':
                    await this.handleNftBurn(payload);
                    break;
                default:
                    this.logger.warn(`Unknown Helius webhook type: ${payload.type}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to process Helius webhook ${payload.type}:`, error);
            throw error;
        }
    }
    async processKycWebhook(payload) {
        this.logger.log(`Processing KYC webhook: ${payload.event} for user ${payload.user_id}`);
        try {
            const kycStatus = payload.status === 'approved' ? 'VERIFIED' : 'REJECTED';
            await this.prisma.user.update({
                where: { id: payload.user_id },
                data: { kycStatus },
            });
            this.logger.log(`User KYC status updated: ${payload.user_id} -> ${kycStatus}`);
        }
        catch (error) {
            this.logger.error(`Failed to process KYC webhook:`, error);
            throw error;
        }
    }
    async processStripeWebhook(payload) {
        this.logger.log(`Processing Stripe webhook: ${payload.type}`);
        try {
            switch (payload.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(payload.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailure(payload.data.object);
                    break;
                case 'customer.created':
                    await this.handleCustomerCreated(payload.data.object);
                    break;
                default:
                    this.logger.warn(`Unknown Stripe webhook type: ${payload.type}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to process Stripe webhook ${payload.type}:`, error);
            throw error;
        }
    }
    async handleNftTransfer(payload) {
        this.logger.log(`NFT transfer processed: ${payload.signature}`);
    }
    async handleNftSale(payload) {
        this.logger.log(`NFT sale processed: ${payload.signature}`);
    }
    async handleNftMint(payload) {
        this.logger.log(`NFT mint processed: ${payload.signature}`);
    }
    async handleNftBurn(payload) {
        this.logger.log(`NFT burn processed: ${payload.signature}`);
    }
    async handlePaymentSuccess(paymentIntent) {
        this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    }
    async handlePaymentFailure(paymentIntent) {
        this.logger.log(`Payment failed: ${paymentIntent.id}`);
    }
    async handleCustomerCreated(customer) {
        this.logger.log(`Customer created: ${customer.id}`);
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map