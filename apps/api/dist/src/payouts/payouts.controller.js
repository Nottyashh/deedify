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
exports.PayoutsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const payouts_service_1 = require("./payouts.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const TriggerPayoutDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid('Invalid listing ID'),
    reason: zod_1.z.enum(['DIVIDEND', 'BUYOUT'], { required_error: 'Reason is required' }),
    amount: zod_1.z.number().positive('Amount must be positive').optional(),
});
let PayoutsController = class PayoutsController {
    constructor(payoutsService) {
        this.payoutsService = payoutsService;
    }
    async triggerPayout(triggerPayoutDto) {
        return this.payoutsService.triggerPayout(triggerPayoutDto);
    }
    async getPayouts(query) {
        return this.payoutsService.getPayouts(query);
    }
    async getListingPayouts(listingId, query) {
        return this.payoutsService.getListingPayouts(listingId, query);
    }
    async getUserPayouts(userId, query) {
        return this.payoutsService.getUserPayouts(userId, query);
    }
    async getStats() {
        return this.payoutsService.getStats();
    }
};
exports.PayoutsController = PayoutsController;
__decorate([
    (0, common_1.Post)('trigger'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger payout distribution (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payout triggered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(TriggerPayoutDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "triggerPayout", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get payouts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payouts retrieved successfully' }),
    __param(0, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "getPayouts", null);
__decorate([
    (0, common_1.Get)('listing/:listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payouts for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payouts retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "getListingPayouts", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user payouts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User payouts retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "getUserPayouts", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payout statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayoutsController.prototype, "getStats", null);
exports.PayoutsController = PayoutsController = __decorate([
    (0, swagger_1.ApiTags)('payouts'),
    (0, common_1.Controller)('payouts'),
    __metadata("design:paramtypes", [payouts_service_1.PayoutsService])
], PayoutsController);
//# sourceMappingURL=payouts.controller.js.map