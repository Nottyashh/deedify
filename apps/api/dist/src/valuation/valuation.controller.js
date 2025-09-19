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
exports.ValuationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const valuation_service_1 = require("./valuation.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const EstimateValueDto = zod_1.z.object({
    location: zod_1.z.string().min(1, 'Location is required'),
    parcelSize: zod_1.z.number().positive('Parcel size must be positive'),
    geoJson: zod_1.z.any().optional(),
    comps: zod_1.z.array(zod_1.z.object({
        location: zod_1.z.string(),
        size: zod_1.z.number(),
        price: zod_1.z.number(),
    })).optional(),
    soilScore: zod_1.z.number().min(0).max(100).optional(),
    infraScore: zod_1.z.number().min(0).max(100).optional(),
});
let ValuationController = class ValuationController {
    constructor(valuationService) {
        this.valuationService = valuationService;
    }
    async estimateValue(estimateValueDto) {
        return this.valuationService.estimateValue(estimateValueDto);
    }
    async getListingValuation(listingId) {
        return this.valuationService.getListingValuation(listingId);
    }
    async refreshValuation(listingId) {
        return this.valuationService.refreshValuation(listingId);
    }
    async getStats() {
        return this.valuationService.getStats();
    }
};
exports.ValuationController = ValuationController;
__decorate([
    (0, common_1.Post)('estimate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Estimate property value' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valuation estimated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(EstimateValueDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ValuationController.prototype, "estimateValue", null);
__decorate([
    (0, common_1.Get)('listing/:listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get valuation for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valuation retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ValuationController.prototype, "getListingValuation", null);
__decorate([
    (0, common_1.Post)('refresh/:listingId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh valuation for a listing (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valuation refreshed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ValuationController.prototype, "refreshValuation", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get valuation statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ValuationController.prototype, "getStats", null);
exports.ValuationController = ValuationController = __decorate([
    (0, swagger_1.ApiTags)('valuation'),
    (0, common_1.Controller)('valuation'),
    __metadata("design:paramtypes", [valuation_service_1.ValuationService])
], ValuationController);
//# sourceMappingURL=valuation.controller.js.map