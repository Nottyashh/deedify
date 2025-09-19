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
exports.ListingsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let ListingsRepository = class ListingsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(args) {
        return this.prisma.listing.findMany(args);
    }
    async findUnique(args) {
        return this.prisma.listing.findUnique(args);
    }
    async findFirst(args) {
        return this.prisma.listing.findFirst(args);
    }
    async create(args) {
        return this.prisma.listing.create(args);
    }
    async update(args) {
        return this.prisma.listing.update(args);
    }
    async delete(args) {
        return this.prisma.listing.delete(args);
    }
    async count(args) {
        return this.prisma.listing.count(args);
    }
    async upsert(args) {
        return this.prisma.listing.upsert(args);
    }
};
exports.ListingsRepository = ListingsRepository;
exports.ListingsRepository = ListingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsRepository);
//# sourceMappingURL=listings.repository.js.map