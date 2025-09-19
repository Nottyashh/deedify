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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findAll(query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.usersRepository.findMany({
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    walletAddress: true,
                    kycStatus: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.usersRepository.count(),
        ]);
        return {
            data: users,
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
    async findById(id) {
        const user = await this.usersRepository.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                walletAddress: true,
                kycStatus: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        listings: true,
                        orders: true,
                        votes: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(id, data) {
        if (data.walletAddress) {
            const isValidWallet = this.isValidSolanaAddress(data.walletAddress);
            if (!isValidWallet) {
                throw new common_1.BadRequestException('Invalid Solana wallet address');
            }
            const existingWallet = await this.usersRepository.findFirst({
                where: {
                    walletAddress: data.walletAddress,
                    id: { not: id },
                },
            });
            if (existingWallet) {
                throw new common_1.BadRequestException('Wallet address is already in use');
            }
        }
        const user = await this.usersRepository.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                role: true,
                walletAddress: true,
                kycStatus: true,
                updatedAt: true,
            },
        });
        this.logger.log(`User updated: ${user.email}`);
        return user;
    }
    async updateKycStatus(id, data) {
        const user = await this.usersRepository.update({
            where: { id },
            data: {
                kycStatus: data.kycStatus,
            },
            select: {
                id: true,
                email: true,
                kycStatus: true,
                updatedAt: true,
            },
        });
        this.logger.log(`User KYC status updated: ${user.email} -> ${user.kycStatus}`);
        return {
            ...user,
            reason: data.reason,
        };
    }
    async getUserListings(userId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [listings, total] = await Promise.all([
            this.usersRepository.findMany({
                where: { id: userId },
                select: {
                    listings: {
                        skip,
                        take: limit,
                        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            locationText: true,
                            parcelSize: true,
                            totalShares: true,
                            pricePerShare: true,
                            status: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            }),
            this.usersRepository.count({
                where: { id: userId },
                select: { listings: true },
            }),
        ]);
        const userListings = listings[0]?.listings || [];
        return {
            data: userListings,
            pagination: {
                page,
                limit,
                total: userListings.length,
                totalPages: Math.ceil(userListings.length / limit),
                hasNext: page < Math.ceil(userListings.length / limit),
                hasPrev: page > 1,
            },
        };
    }
    async getUserOrders(userId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.usersRepository.findMany({
                where: { id: userId },
                select: {
                    orders: {
                        skip,
                        take: limit,
                        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                        select: {
                            id: true,
                            type: true,
                            price: true,
                            status: true,
                            txSignature: true,
                            createdAt: true,
                            listing: {
                                select: {
                                    id: true,
                                    title: true,
                                    locationText: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.usersRepository.count({
                where: { id: userId },
                select: { orders: true },
            }),
        ]);
        const userOrders = orders[0]?.orders || [];
        return {
            data: userOrders,
            pagination: {
                page,
                limit,
                total: userOrders.length,
                totalPages: Math.ceil(userOrders.length / limit),
                hasNext: page < Math.ceil(userOrders.length / limit),
                hasPrev: page > 1,
            },
        };
    }
    async getUserVotes(userId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [votes, total] = await Promise.all([
            this.usersRepository.findMany({
                where: { id: userId },
                select: {
                    votes: {
                        skip,
                        take: limit,
                        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                        select: {
                            id: true,
                            choice: true,
                            weightDecimal: true,
                            createdAt: true,
                            proposal: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    status: true,
                                    endsAt: true,
                                    listing: {
                                        select: {
                                            id: true,
                                            title: true,
                                            locationText: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            this.usersRepository.count({
                where: { id: userId },
                select: { votes: true },
            }),
        ]);
        const userVotes = votes[0]?.votes || [];
        return {
            data: userVotes,
            pagination: {
                page,
                limit,
                total: userVotes.length,
                totalPages: Math.ceil(userVotes.length / limit),
                hasNext: page < Math.ceil(userVotes.length / limit),
                hasPrev: page > 1,
            },
        };
    }
    isValidSolanaAddress(address) {
        try {
            return address.length >= 32 && address.length <= 44;
        }
        catch {
            return false;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map