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
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const marketplace_service_1 = require("./marketplace.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const ListShareDto = zod_1.z.object({
    shareMint: zod_1.z.string().min(1, 'Share mint address is required'),
    price: zod_1.z.number().positive('Price must be positive'),
});
const BuyShareDto = zod_1.z.object({
    shareMint: zod_1.z.string().min(1, 'Share mint address is required'),
    buyerWallet: zod_1.z.string().min(1, 'Buyer wallet address is required'),
});
const SellShareDto = zod_1.z.object({
    shareMint: zod_1.z.string().min(1, 'Share mint address is required'),
    price: zod_1.z.number().positive('Price must be positive'),
});
const CancelOrderDto = zod_1.z.object({
    orderId: zod_1.z.string().cuid('Invalid order ID'),
});
let MarketplaceController = class MarketplaceController {
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    async listShare(req, listShareDto) {
        return this.marketplaceService.listShare(req.user.sub, listShareDto);
    }
    async buyShare(req, buyShareDto) {
        return this.marketplaceService.buyShare(req.user.sub, buyShareDto);
    }
    async sellShare(req, sellShareDto) {
        return this.marketplaceService.sellShare(req.user.sub, sellShareDto);
    }
    async cancelOrder(req, cancelOrderDto) {
        return this.marketplaceService.cancelOrder(req.user.sub, cancelOrderDto);
    }
    async getUserOrders(req, query) {
        return this.marketplaceService.getUserOrders(req.user.sub, query);
    }
    async getOrder(id) {
        return this.marketplaceService.getOrder(id);
    }
    async getListings(query) {
        return this.marketplaceService.getListings(query);
    }
    async getListingShares(listingId, query) {
        return this.marketplaceService.getListingShares(listingId, query);
    }
    async getShareHistory(shareMint, query) {
        return this.marketplaceService.getShareHistory(shareMint, query);
    }
    async getStats() {
        return this.marketplaceService.getStats();
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, common_1.Post)('list'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'List a share for sale' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Share listed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Share not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(ListShareDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "listShare", null);
__decorate([
    (0, common_1.Post)('buy'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Buy a share' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Share purchased successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Share or order not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(BuyShareDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "buyShare", null);
__decorate([
    (0, common_1.Post)('sell'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Sell a share' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Share sold successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Share not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(SellShareDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "sellShare", null);
__decorate([
    (0, common_1.Post)('cancel'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an order' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(CancelOrderDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)('listings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active marketplace listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listings retrieved successfully' }),
    __param(0, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getListings", null);
__decorate([
    (0, common_1.Get)('listings/:listingId/shares'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available shares for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shares retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getListingShares", null);
__decorate([
    (0, common_1.Get)('history/:shareMint'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trading history for a share' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trading history retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Share not found' }),
    __param(0, (0, common_1.Param)('shareMint')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getShareHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get marketplace statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getStats", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, swagger_1.ApiTags)('marketplace'),
    (0, common_1.Controller)('marketplace'),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map