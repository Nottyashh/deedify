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
var MarketplaceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const marketplace_repository_1 = require("./marketplace.repository");
const nfts_repository_1 = require("../nfts/nfts.repository");
const listings_repository_1 = require("../listings/listings.repository");
let MarketplaceService = MarketplaceService_1 = class MarketplaceService {
    constructor(marketplaceRepository, nftsRepository, listingsRepository, solanaService) {
        this.marketplaceRepository = marketplaceRepository;
        this.nftsRepository = nftsRepository;
        this.listingsRepository = listingsRepository;
        this.solanaService = solanaService;
        this.logger = new common_1.Logger(MarketplaceService_1.name);
    }
    async listShare(userId, data) {
        const share = await this.nftsRepository.findUnique({
            where: { mintAddress: data.shareMint },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
            },
        });
        if (!share) {
            throw new common_1.NotFoundException('Share not found');
        }
        if (share.listing.status !== 'LIVE') {
            throw new common_1.BadRequestException('Cannot list shares from inactive listings');
        }
        const existingOrder = await this.marketplaceRepository.findFirst({
            where: {
                shareMint: data.shareMint,
                status: 'OPEN',
            },
        });
        if (existingOrder) {
            throw new common_1.BadRequestException('Share is already listed for sale');
        }
        const order = await this.marketplaceRepository.create({
            data: {
                type: 'LIST',
                listingId: share.listingId,
                shareMint: data.shareMint,
                sellerId: userId,
                price: data.price,
                status: 'OPEN',
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        locationText: true,
                    },
                },
                shareToken: {
                    select: {
                        id: true,
                        indexNumber: true,
                    },
                },
            },
        });
        this.logger.log(`Share listed for sale: ${data.shareMint} at ${data.price} SOL`);
        return order;
    }
    async buyShare(userId, data) {
        const order = await this.marketplaceRepository.findFirst({
            where: {
                shareMint: data.shareMint,
                status: 'OPEN',
                type: 'LIST',
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
                shareToken: {
                    select: {
                        id: true,
                        indexNumber: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        email: true,
                        walletAddress: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('No active listing found for this share');
        }
        if (order.sellerId === userId) {
            throw new common_1.BadRequestException('Cannot buy your own share');
        }
        if (order.listing.status !== 'LIVE') {
            throw new common_1.BadRequestException('Cannot buy shares from inactive listings');
        }
        try {
            const txSignature = await this.executeTrade({
                shareMint: data.shareMint,
                sellerWallet: order.seller.walletAddress,
                buyerWallet: data.buyerWallet,
                price: order.price,
            });
            const updatedOrder = await this.marketplaceRepository.update({
                where: { id: order.id },
                data: {
                    status: 'FILLED',
                    buyerId: userId,
                    txSignature,
                },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    shareToken: {
                        select: {
                            id: true,
                            indexNumber: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    buyer: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            });
            this.logger.log(`Share purchased: ${data.shareMint} by ${userId} for ${order.price} SOL`);
            return updatedOrder;
        }
        catch (error) {
            this.logger.error(`Failed to execute trade for share ${data.shareMint}:`, error);
            throw new common_1.BadRequestException('Failed to execute trade');
        }
    }
    async sellShare(userId, data) {
        const share = await this.nftsRepository.findUnique({
            where: { mintAddress: data.shareMint },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
            },
        });
        if (!share) {
            throw new common_1.NotFoundException('Share not found');
        }
        if (share.listing.status !== 'LIVE') {
            throw new common_1.BadRequestException('Cannot sell shares from inactive listings');
        }
        const existingOrder = await this.marketplaceRepository.findFirst({
            where: {
                shareMint: data.shareMint,
                status: 'OPEN',
            },
        });
        if (existingOrder) {
            throw new common_1.BadRequestException('Share is already listed for sale');
        }
        const order = await this.marketplaceRepository.create({
            data: {
                type: 'SELL',
                listingId: share.listingId,
                shareMint: data.shareMint,
                sellerId: userId,
                price: data.price,
                status: 'OPEN',
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        locationText: true,
                    },
                },
                shareToken: {
                    select: {
                        id: true,
                        indexNumber: true,
                    },
                },
            },
        });
        this.logger.log(`Share listed for sale: ${data.shareMint} at ${data.price} SOL`);
        return order;
    }
    async cancelOrder(userId, data) {
        const order = await this.marketplaceRepository.findUnique({
            where: { id: data.orderId },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                shareToken: {
                    select: {
                        id: true,
                        indexNumber: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.sellerId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own orders');
        }
        if (order.status !== 'OPEN') {
            throw new common_1.BadRequestException('Cannot cancel filled or cancelled orders');
        }
        const updatedOrder = await this.marketplaceRepository.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                shareToken: {
                    select: {
                        id: true,
                        indexNumber: true,
                    },
                },
            },
        });
        this.logger.log(`Order cancelled: ${order.id}`);
        return updatedOrder;
    }
    async getUserOrders(userId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.marketplaceRepository.findMany({
                where: {
                    OR: [
                        { sellerId: userId },
                        { buyerId: userId },
                    ],
                },
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
                    shareToken: {
                        select: {
                            id: true,
                            indexNumber: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    buyer: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            }),
            this.marketplaceRepository.count({
                where: {
                    OR: [
                        { sellerId: userId },
                        { buyerId: userId },
                    ],
                },
            }),
        ]);
        return {
            data: orders,
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
    async getOrder(id) {
        const order = await this.marketplaceRepository.findUnique({
            where: { id },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        locationText: true,
                        parcelSize: true,
                        pricePerShare: true,
                    },
                },
                shareToken: {
                    select: {
                        id: true,
                        indexNumber: true,
                        metadataUri: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        email: true,
                        walletAddress: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        email: true,
                        walletAddress: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async getListings(query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.marketplaceRepository.findMany({
                where: {
                    status: 'OPEN',
                    type: 'LIST',
                },
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            locationText: true,
                            parcelSize: true,
                            pricePerShare: true,
                        },
                    },
                    shareToken: {
                        select: {
                            id: true,
                            indexNumber: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            }),
            this.marketplaceRepository.count({
                where: {
                    status: 'OPEN',
                    type: 'LIST',
                },
            }),
        ]);
        return {
            data: orders,
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
    async getListingShares(listingId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const listing = await this.listingsRepository.findUnique({
            where: { id: listingId },
            select: { id: true, title: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const [orders, total] = await Promise.all([
            this.marketplaceRepository.findMany({
                where: {
                    listingId,
                    status: 'OPEN',
                    type: 'LIST',
                },
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { price: 'asc' },
                include: {
                    shareToken: {
                        select: {
                            id: true,
                            indexNumber: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            }),
            this.marketplaceRepository.count({
                where: {
                    listingId,
                    status: 'OPEN',
                    type: 'LIST',
                },
            }),
        ]);
        return {
            data: orders,
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
    async getShareHistory(shareMint, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.marketplaceRepository.findMany({
                where: {
                    shareMint,
                    status: 'FILLED',
                },
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
                    shareToken: {
                        select: {
                            id: true,
                            indexNumber: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    buyer: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
            }),
            this.marketplaceRepository.count({
                where: {
                    shareMint,
                    status: 'FILLED',
                },
            }),
        ]);
        return {
            data: orders,
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
        const [totalOrders, openOrders, filledOrders, totalVolume, activeListings,] = await Promise.all([
            this.marketplaceRepository.count(),
            this.marketplaceRepository.count({ where: { status: 'OPEN' } }),
            this.marketplaceRepository.count({ where: { status: 'FILLED' } }),
            this.marketplaceRepository.aggregate({
                _sum: { price: true },
                where: { status: 'FILLED' },
            }),
            this.listingsRepository.count({ where: { status: 'LIVE' } }),
        ]);
        return {
            orders: {
                total: totalOrders,
                open: openOrders,
                filled: filledOrders,
                cancelled: totalOrders - openOrders - filledOrders,
            },
            volume: {
                total: totalVolume._sum.price || 0,
            },
            listings: {
                active: activeListings,
            },
        };
    }
    async executeTrade(data) {
        try {
            const txSignature = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
            this.logger.log(`Trade executed: ${data.shareMint} from ${data.sellerWallet} to ${data.buyerWallet} for ${data.price} SOL`);
            return txSignature;
        }
        catch (error) {
            this.logger.error(`Failed to execute trade:`, error);
            throw new common_1.BadRequestException('Failed to execute trade on Solana');
        }
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = MarketplaceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [marketplace_repository_1.MarketplaceRepository,
        nfts_repository_1.NftsRepository,
        listings_repository_1.ListingsRepository, Object])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map