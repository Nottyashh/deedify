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
var PayoutsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutsService = void 0;
const common_1 = require("@nestjs/common");
const payouts_repository_1 = require("./payouts.repository");
const listings_repository_1 = require("../listings/listings.repository");
let PayoutsService = PayoutsService_1 = class PayoutsService {
    constructor(payoutsRepository, listingsRepository) {
        this.payoutsRepository = payoutsRepository;
        this.listingsRepository = listingsRepository;
        this.logger = new common_1.Logger(PayoutsService_1.name);
    }
    async triggerPayout(data) {
        const listing = await this.listingsRepository.findUnique({
            where: { id: data.listingId },
            select: {
                id: true,
                title: true,
                totalShares: true,
                pricePerShare: true,
                status: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.status !== 'LIVE') {
            throw new common_1.BadRequestException('Cannot trigger payouts for inactive listings');
        }
        let payoutAmount = data.amount;
        if (!payoutAmount) {
            if (data.reason === 'DIVIDEND') {
                payoutAmount = Number(listing.pricePerShare) * 0.1;
            }
            else if (data.reason === 'BUYOUT') {
                payoutAmount = Number(listing.pricePerShare);
            }
        }
        const payout = await this.payoutsRepository.create({
            data: {
                listingId: data.listingId,
                amount: payoutAmount,
                reason: data.reason,
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        locationText: true,
                    },
                },
            },
        });
        this.logger.log(`Payout triggered: ${data.reason} for listing ${listing.title} - ${payoutAmount} SOL`);
        return payout;
    }
    async getPayouts(query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [payouts, total] = await Promise.all([
            this.payoutsRepository.findMany({
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            locationText: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            }),
            this.payoutsRepository.count(),
        ]);
        return {
            data: payouts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async getListingPayouts(listingId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const listing = await this.listingsRepository.findUnique({
            where: { id: listingId },
            select: { id: true, title: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const [payouts, total] = await Promise.all([
            this.payoutsRepository.findMany({
                where: { listingId },
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            }),
            this.payoutsRepository.count({ where: { listingId } }),
        ]);
        return {
            data: payouts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async getUserPayouts(userId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [payouts, total] = await Promise.all([
            this.payoutsRepository.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            locationText: true,
                        },
                    },
                },
            }),
            this.payoutsRepository.count({ where: { userId } }),
        ]);
        return {
            data: payouts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
            },
        };
    }
    async getStats() {
        const [totalPayouts, totalAmount, dividendPayouts, buyoutPayouts,] = await Promise.all([
            this.payoutsRepository.count(),
            this.payoutsRepository.aggregate({
                _sum: { amount: true },
            }),
            this.payoutsRepository.count({ where: { reason: 'DIVIDEND' } }),
            this.payoutsRepository.count({ where: { reason: 'BUYOUT' } }),
        ]);
        return {
            total: {
                payouts: totalPayouts,
                amount: totalAmount._sum.amount || 0,
            },
            byType: {
                dividends: dividendPayouts,
                buyouts: buyoutPayouts,
            },
        };
    }
};
exports.PayoutsService = PayoutsService;
exports.PayoutsService = PayoutsService = PayoutsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payouts_repository_1.PayoutsRepository,
        listings_repository_1.ListingsRepository])
], PayoutsService);
//# sourceMappingURL=payouts.service.js.map