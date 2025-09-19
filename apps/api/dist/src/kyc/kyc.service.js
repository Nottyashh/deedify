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
var KycService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let KycService = KycService_1 = class KycService {
    constructor(prisma, kycProvider) {
        this.prisma = prisma;
        this.kycProvider = kycProvider;
        this.logger = new common_1.Logger(KycService_1.name);
    }
    async initiateVerification(userId, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, kycStatus: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.kycStatus === 'VERIFIED') {
            throw new common_1.BadRequestException('User is already verified');
        }
        try {
            const result = await this.kycProvider.initiateVerification({
                userId,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth,
                country: data.country,
            });
            await this.prisma.user.update({
                where: { id: userId },
                data: { kycStatus: 'PENDING' },
            });
            this.logger.log(`KYC verification initiated for user ${userId}`);
            return {
                verificationUrl: result.verificationUrl,
                verificationId: result.verificationId,
                status: 'PENDING',
            };
        }
        catch (error) {
            this.logger.error(`Failed to initiate KYC verification for user ${userId}:`, error);
            throw new common_1.BadRequestException('Failed to initiate KYC verification');
        }
    }
    async getVerificationStatus(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                kycStatus: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            userId: user.id,
            email: user.email,
            status: user.kycStatus,
            lastUpdated: user.updatedAt,
        };
    }
    async handleCallback(payload) {
        try {
            const result = await this.kycProvider.handleCallback(payload);
            const kycStatus = result.status === 'approved' ? 'VERIFIED' : 'REJECTED';
            await this.prisma.user.update({
                where: { id: result.userId },
                data: { kycStatus },
            });
            this.logger.log(`KYC callback processed for user ${result.userId}: ${kycStatus}`);
            return {
                success: true,
                userId: result.userId,
                status: kycStatus,
            };
        }
        catch (error) {
            this.logger.error('Failed to process KYC callback:', error);
            throw new common_1.BadRequestException('Failed to process KYC callback');
        }
    }
};
exports.KycService = KycService;
exports.KycService = KycService = KycService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], KycService);
//# sourceMappingURL=kyc.service.js.map