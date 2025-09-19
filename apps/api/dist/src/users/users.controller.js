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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const users_service_1 = require("./users.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const UpdateUserDto = zod_1.z.object({
    role: zod_1.z.enum(['INVESTOR', 'LISTER', 'ADMIN']).optional(),
    kycStatus: zod_1.z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']).optional(),
    walletAddress: zod_1.z.string().optional(),
});
const UpdateKycStatusDto = zod_1.z.object({
    kycStatus: zod_1.z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']),
    reason: zod_1.z.string().optional(),
});
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(query) {
        return this.usersService.findAll(query);
    }
    async getCurrentUser(req) {
        return this.usersService.findById(req.user.sub);
    }
    async findOne(id) {
        return this.usersService.findById(id);
    }
    async update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    async updateKycStatus(id, updateKycDto) {
        return this.usersService.updateKycStatus(id, updateKycDto);
    }
    async getUserListings(id, query) {
        return this.usersService.getUserListings(id, query);
    }
    async getUserOrders(id, query) {
        return this.usersService.getUserOrders(id, query);
    }
    async getUserVotes(id, query) {
        return this.usersService.getUserVotes(id, query);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users retrieved successfully' }),
    __param(0, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id'),
    (0, common_1.UseGuards)(jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update user (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(UpdateUserDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/kyc'),
    (0, common_1.UseGuards)(jwt_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update user KYC status (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(UpdateKycStatusDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateKycStatus", null);
__decorate([
    (0, common_1.Get)(':id/listings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user listings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User listings retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserListings", null);
__decorate([
    (0, common_1.Get)(':id/orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserOrders", null);
__decorate([
    (0, common_1.Get)(':id/votes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user votes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User votes retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserVotes", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map