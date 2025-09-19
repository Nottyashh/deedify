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
exports.MarketplaceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let MarketplaceRepository = class MarketplaceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(args) {
        return this.prisma.order.findMany(args);
    }
    async findUnique(args) {
        return this.prisma.order.findUnique(args);
    }
    async findFirst(args) {
        return this.prisma.order.findFirst(args);
    }
    async create(args) {
        return this.prisma.order.create(args);
    }
    async update(args) {
        return this.prisma.order.update(args);
    }
    async delete(args) {
        return this.prisma.order.delete(args);
    }
    async count(args) {
        return this.prisma.order.count(args);
    }
    async aggregate(args) {
        return this.prisma.order.aggregate(args);
    }
    async upsert(args) {
        return this.prisma.order.upsert(args);
    }
};
exports.MarketplaceRepository = MarketplaceRepository;
exports.MarketplaceRepository = MarketplaceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceRepository);
//# sourceMappingURL=marketplace.repository.js.map