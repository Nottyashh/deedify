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
exports.ListingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const listings_service_1 = require("./listings.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const CreateListingDto = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().min(1).max(2000),
    locationText: zod_1.z.string().min(1).max(500),
    geoJson: zod_1.z.any().optional(),
    parcelSize: zod_1.z.number().positive(),
    coordinatePolicy: zod_1.z.boolean().default(true),
    coordinatePolicyNote: zod_1.z.string().optional(),
    totalShares: zod_1.z.number().int().min(1).max(10000).default(100),
    pricePerShare: zod_1.z.number().positive(),
});
const UpdateListingDto = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().min(1).max(2000).optional(),
    locationText: zod_1.z.string().min(1).max(500).optional(),
    geoJson: zod_1.z.any().optional(),
    parcelSize: zod_1.z.number().positive().optional(),
    coordinatePolicy: zod_1.z.boolean().optional(),
    coordinatePolicyNote: zod_1.z.string().optional(),
    totalShares: zod_1.z.number().int().min(1).max(10000).optional(),
    pricePerShare: zod_1.z.number().positive().optional(),
    status: zod_1.z.enum(['PENDING', 'LIVE', 'PAUSED', 'CLOSED']).optional(),
});
const SearchListingsDto = zod_1.z.object({
    ...pagination_dto_1.PaginationDto.shape,
    search: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    minPrice: zod_1.z.number().positive().optional(),
    maxPrice: zod_1.z.number().positive().optional(),
    minSize: zod_1.z.number().positive().optional(),
    maxSize: zod_1.z.number().positive().optional(),
    status: zod_1.z.enum(['PENDING', 'LIVE', 'PAUSED', 'CLOSED']).optional(),
});
let ListingsController = class ListingsController {
    constructor(listingsService) {
        this.listingsService = listingsService;
    }
    async create(req, createListingDto) {
        return this.listingsService.create(req.user.sub, createListingDto);
    }
    async findAll(query) {
        return this.listingsService.findAll(query);
    }
    async findPublic(query) {
        return this.listingsService.findPublic(query);
    }
    async findOne(id) {
        return this.listingsService.findOne(id);
    }
    async update(id, req, updateListingDto) {
        return this.listingsService.update(id, req.user.sub, updateListingDto);
    }
    async updateStatus(id, body) {
        return this.listingsService.updateStatus(id, body.status);
    }
    async getShares(id) {
        return this.listingsService.getShares(id);
    }
    async getValuation(id) {
        return this.listingsService.getValuation(id);
    }
    async updateValuation(id) {
        return this.listingsService.updateValuation(id);
    }
};
exports.ListingsController = ListingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.ListerGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new listing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Listing created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(CreateListingDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all listings with search and filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listings retrieved successfully' }),
    __param(0, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(SearchListingsDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public listings (no auth required)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public listings retrieved successfully' }),
    __param(0, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(SearchListingsDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get listing by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(UpdateListingDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update listing status (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id/shares'),
    (0, swagger_1.ApiOperation)({ summary: 'Get listing share tokens' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Share tokens retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getShares", null);
__decorate([
    (0, common_1.Get)(':id/valuation'),
    (0, swagger_1.ApiOperation)({ summary: 'Get listing valuation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valuation retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "getValuation", null);
__decorate([
    (0, common_1.Post)(':id/valuation'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger valuation update (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valuation updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListingsController.prototype, "updateValuation", null);
exports.ListingsController = ListingsController = __decorate([
    (0, swagger_1.ApiTags)('listings'),
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_service_1.ListingsService])
], ListingsController);
//# sourceMappingURL=listings.controller.js.map