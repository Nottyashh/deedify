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
exports.VotesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const votes_service_1 = require("./votes.service");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const zod_pipe_1 = require("../common/pipes/zod.pipe");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const CreateProposalDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid('Invalid listing ID'),
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: zod_1.z.string().min(1, 'Description is required').max(2000, 'Description too long'),
    startsAt: zod_1.z.string().datetime('Invalid start date'),
    endsAt: zod_1.z.string().datetime('Invalid end date'),
});
const VoteDto = zod_1.z.object({
    proposalId: zod_1.z.string().cuid('Invalid proposal ID'),
    choice: zod_1.z.enum(['YES', 'NO'], { required_error: 'Choice is required' }),
});
let VotesController = class VotesController {
    constructor(votesService) {
        this.votesService = votesService;
    }
    async createProposal(req, createProposalDto) {
        return this.votesService.createProposal(req.user.sub, createProposalDto);
    }
    async getProposals(query) {
        return this.votesService.getProposals(query);
    }
    async getProposal(id) {
        return this.votesService.getProposal(id);
    }
    async getProposalResults(id) {
        return this.votesService.getProposalResults(id);
    }
    async castVote(req, voteDto) {
        return this.votesService.castVote(req.user.sub, voteDto);
    }
    async getUserVotes(req, query) {
        return this.votesService.getUserVotes(req.user.sub, query);
    }
    async getUserVoteForProposal(req, proposalId) {
        return this.votesService.getUserVoteForProposal(req.user.sub, proposalId);
    }
    async closeProposal(id) {
        return this.votesService.closeProposal(id);
    }
    async getStats() {
        return this.votesService.getStats();
    }
};
exports.VotesController = VotesController;
__decorate([
    (0, common_1.Post)('proposals'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.ListerGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new proposal' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Proposal created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Listing not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(CreateProposalDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "createProposal", null);
__decorate([
    (0, common_1.Get)('proposals'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all proposals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proposals retrieved successfully' }),
    __param(0, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getProposals", null);
__decorate([
    (0, common_1.Get)('proposals/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get proposal by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proposal retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proposal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getProposal", null);
__decorate([
    (0, common_1.Get)('proposals/:id/results'),
    (0, swagger_1.ApiOperation)({ summary: 'Get proposal voting results' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voting results retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proposal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getProposalResults", null);
__decorate([
    (0, common_1.Post)('vote'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cast a vote on a proposal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vote cast successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proposal not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new zod_pipe_1.ZodValidationPipe(VoteDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "castVote", null);
__decorate([
    (0, common_1.Get)('my-votes'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user votes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User votes retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)(new zod_pipe_1.ZodValidationPipe(pagination_dto_1.PaginationDto))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getUserVotes", null);
__decorate([
    (0, common_1.Get)('proposals/:id/my-vote'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user vote for a specific proposal' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User vote retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proposal not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getUserVoteForProposal", null);
__decorate([
    (0, common_1.Post)('proposals/:id/close'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Close a proposal (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proposal closed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proposal not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "closeProposal", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get voting statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VotesController.prototype, "getStats", null);
exports.VotesController = VotesController = __decorate([
    (0, swagger_1.ApiTags)('votes'),
    (0, common_1.Controller)('votes'),
    __metadata("design:paramtypes", [votes_service_1.VotesService])
], VotesController);
//# sourceMappingURL=votes.controller.js.map