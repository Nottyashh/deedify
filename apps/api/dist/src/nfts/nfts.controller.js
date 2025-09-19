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
exports.NftsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const nfts_service_1 = require("./nfts.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const MintCollectionDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(1).max(1000),
    image: zod_1.z.string().url().optional(),
    attributes: zod_1.z.array(zod_1.z.object({
        trait_type: zod_1.z.string(),
        value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    })).optional(),
});
const MintFractionsDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid(),
    totalShares: zod_1.z.number().int().min(1).max(10000),
    baseName: zod_1.z.string().min(1).max(100),
    baseDescription: zod_1.z.string().min(1).max(1000),
    image: zod_1.z.string().url().optional(),
    attributes: zod_1.z.array(zod_1.z.object({
        trait_type: zod_1.z.string(),
        value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    })).optional(),
});
let NftsController = class NftsController {
    constructor(nftsService) {
        this.nftsService = nftsService;
    }
    async mintCollection(req, mintCollectionDto) {
        return this.nftsService.mintCollection(req.user.sub, mintCollectionDto);
    }
    async mintFractions(req, mintFractionsDto) {
        return this.nftsService.mintFractions(req.user.sub, mintFractionsDto);
    }
    async getCollection(listingId) {
        return this.nftsService.getCollection(listingId);
    }
    async getFractions(listingId, query) {
        return this.nftsService.getFractions(listingId, query);
    }
    async getMetadata(mintAddress) {
        return this.nftsService.getMetadata(mintAddress);
    }
    async getOwnedNfts(walletAddress, query) {
        return this.nftsService.getOwnedNfts(walletAddress, query);
    }
    async verifyCollection(listingId) {
        return this.nftsService.verifyCollection(listingId);
    }
    async getStats(listingId) {
        return this.nftsService.getStats(listingId);
    }
};
exports.NftsController = NftsController;
__decorate([
    (0, common_1.Post)('collection'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.ListerGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Mint collection NFT for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Collection NFT minted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(MintCollectionDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "mintCollection", null);
__decorate([
    (0, common_1.Post)('fractions'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.ListerGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Mint fractional NFTs for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fractional NFTs minted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(MintFractionsDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "mintFractions", null);
__decorate([
    (0, common_1.Get)('collection/:listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get collection NFT for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collection NFT retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Collection not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getCollection", null);
__decorate([
    (0, common_1.Get)('fractions/:listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get fractional NFTs for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Fractional NFTs retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getFractions", null);
__decorate([
    (0, common_1.Get)('metadata/:mintAddress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NFT metadata by mint address' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NFT metadata retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'NFT not found' }),
    __param(0, (0, common_1.Param)('mintAddress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getMetadata", null);
__decorate([
    (0, common_1.Get)('owner/:walletAddress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NFTs owned by wallet address' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Owned NFTs retrieved successfully' }),
    __param(0, (0, common_1.Param)('walletAddress')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getOwnedNfts", null);
__decorate([
    (0, common_1.Post)('verify/:listingId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify collection authority (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Collection verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "verifyCollection", null);
__decorate([
    (0, common_1.Get)('stats/:listingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get NFT statistics for a listing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'NFT statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Param)('listingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NftsController.prototype, "getStats", null);
exports.NftsController = NftsController = __decorate([
    (0, swagger_1.ApiTags)('nfts'),
    (0, common_1.Controller)('nfts'),
    __metadata("design:paramtypes", [nfts_service_1.NftsService])
], NftsController);
//# sourceMappingURL=nfts.controller.js.map