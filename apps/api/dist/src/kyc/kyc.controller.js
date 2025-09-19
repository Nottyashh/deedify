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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const kyc_service_1 = require("./kyc.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const InitiateKycDto = zod_1.z.object({
    userId: zod_1.z.string().cuid('Invalid user ID'),
    email: zod_1.z.string().email('Invalid email'),
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    dateOfBirth: zod_1.z.string().datetime('Invalid date of birth'),
    country: zod_1.z.string().min(2, 'Country code is required'),
});
let KycController = class KycController {
    constructor(kycService) {
        this.kycService = kycService;
    }
    async initiateKyc(req, initiateKycDto) {
        return this.kycService.initiateVerification(req.user.sub, initiateKycDto);
    }
    async getKycStatus(userId) {
        return this.kycService.getVerificationStatus(userId);
    }
    async getMyKycStatus(req) {
        return this.kycService.getVerificationStatus(req.user.sub);
    }
    async handleCallback(payload) {
        return this.kycService.handleCallback(payload);
    }
};
exports.KycController = KycController;
__decorate([
    (0, common_1.Post)('initiate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate KYC verification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC verification initiated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(InitiateKycDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "initiateKyc", null);
__decorate([
    (0, common_1.Get)('status/:userId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC verification status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC status retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getKycStatus", null);
__decorate([
    (0, common_1.Get)('my-status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user KYC status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC status retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getMyKycStatus", null);
__decorate([
    (0, common_1.Post)('callback'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Handle KYC provider callback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Callback processed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid callback data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "handleCallback", null);
exports.KycController = KycController = __decorate([
    (0, swagger_1.ApiTags)('kyc'),
    (0, common_1.Controller)('kyc'),
    __metadata("design:paramtypes", [kyc_service_1.KycService])
], KycController);
//# sourceMappingURL=kyc.controller.js.map