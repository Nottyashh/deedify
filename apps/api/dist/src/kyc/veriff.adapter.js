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
var VeriffAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeriffAdapter = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let VeriffAdapter = VeriffAdapter_1 = class VeriffAdapter {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(VeriffAdapter_1.name);
        this.baseUrl = 'https://stationapi.veriff.com/v1';
        this.apiKey = this.configService.get('KYC_API_KEY');
        if (!this.apiKey) {
            throw new Error('KYC_API_KEY is required for Veriff integration');
        }
    }
    async initiateVerification(data) {
        try {
            const verificationId = `veriff_${data.userId}_${Date.now()}`;
            const verificationUrl = `https://magic.veriff.com/v/${verificationId}`;
            this.logger.log(`Veriff verification initiated for user ${data.userId}`);
            return {
                verificationUrl,
                verificationId,
            };
        }
        catch (error) {
            this.logger.error('Failed to initiate Veriff verification:', error);
            throw error;
        }
    }
    async getVerificationStatus(verificationId) {
        try {
            this.logger.log(`Getting Veriff verification status for ${verificationId}`);
            return {
                status: 'pending',
                data: {
                    verificationId,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            this.logger.error('Failed to get Veriff verification status:', error);
            throw error;
        }
    }
    async handleCallback(payload) {
        try {
            this.logger.log('Processing Veriff callback:', payload);
            const userId = payload.user_id || 'unknown';
            const status = payload.status === 'approved' ? 'approved' : 'declined';
            return {
                userId,
                status,
            };
        }
        catch (error) {
            this.logger.error('Failed to process Veriff callback:', error);
            throw error;
        }
    }
};
exports.VeriffAdapter = VeriffAdapter;
exports.VeriffAdapter = VeriffAdapter = VeriffAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VeriffAdapter);
//# sourceMappingURL=veriff.adapter.js.map