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
exports.NftsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let NftsRepository = class NftsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(args) {
        return this.prisma.shareToken.findMany(args);
    }
    async findUnique(args) {
        return this.prisma.shareToken.findUnique(args);
    }
    async findFirst(args) {
        return this.prisma.shareToken.findFirst(args);
    }
    async create(args) {
        return this.prisma.shareToken.create(args);
    }
    async update(args) {
        return this.prisma.shareToken.update(args);
    }
    async delete(args) {
        return this.prisma.shareToken.delete(args);
    }
    async count(args) {
        return this.prisma.shareToken.count(args);
    }
    async upsert(args) {
        return this.prisma.shareToken.upsert(args);
    }
};
exports.NftsRepository = NftsRepository;
exports.NftsRepository = NftsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NftsRepository);
//# sourceMappingURL=nfts.repository.js.map