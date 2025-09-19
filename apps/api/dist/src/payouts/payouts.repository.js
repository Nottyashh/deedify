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
exports.PayoutsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let PayoutsRepository = class PayoutsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(args) {
        return this.prisma.payout.findMany(args);
    }
    async findUnique(args) {
        return this.prisma.payout.findUnique(args);
    }
    async findFirst(args) {
        return this.prisma.payout.findFirst(args);
    }
    async create(args) {
        return this.prisma.payout.create(args);
    }
    async update(args) {
        return this.prisma.payout.update(args);
    }
    async delete(args) {
        return this.prisma.payout.delete(args);
    }
    async count(args) {
        return this.prisma.payout.count(args);
    }
    async aggregate(args) {
        return this.prisma.payout.aggregate(args);
    }
    async upsert(args) {
        return this.prisma.payout.upsert(args);
    }
};
exports.PayoutsRepository = PayoutsRepository;
exports.PayoutsRepository = PayoutsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayoutsRepository);
//# sourceMappingURL=payouts.repository.js.map