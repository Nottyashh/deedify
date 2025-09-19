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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let VotesRepository = class VotesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findProposals(args) {
        return this.prisma.proposal.findMany(args);
    }
    async findProposal(args) {
        return this.prisma.proposal.findUnique(args);
    }
    async createProposal(args) {
        return this.prisma.proposal.create(args);
    }
    async updateProposal(args) {
        return this.prisma.proposal.update(args);
    }
    async deleteProposal(args) {
        return this.prisma.proposal.delete(args);
    }
    async countProposals(args) {
        return this.prisma.proposal.count(args);
    }
    async findVotes(args) {
        return this.prisma.vote.findMany(args);
    }
    async findVote(args) {
        return this.prisma.vote.findUnique(args);
    }
    async createVote(args) {
        return this.prisma.vote.create(args);
    }
    async updateVote(args) {
        return this.prisma.vote.update(args);
    }
    async upsertVote(args) {
        return this.prisma.vote.upsert(args);
    }
    async deleteVote(args) {
        return this.prisma.vote.delete(args);
    }
    async countVotes(args) {
        return this.prisma.vote.count(args);
    }
};
exports.VotesRepository = VotesRepository;
exports.VotesRepository = VotesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VotesRepository);
//# sourceMappingURL=votes.repository.js.map