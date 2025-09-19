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
var VotesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VotesService = void 0;
const common_1 = require("@nestjs/common");
const votes_repository_1 = require("./votes.repository");
const listings_repository_1 = require("../listings/listings.repository");
let VotesService = VotesService_1 = class VotesService {
    constructor(votesRepository, listingsRepository, solanaService) {
        this.votesRepository = votesRepository;
        this.listingsRepository = listingsRepository;
        this.solanaService = solanaService;
        this.logger = new common_1.Logger(VotesService_1.name);
    }
    async createProposal(userId, data) {
        const listing = await this.listingsRepository.findUnique({
            where: { id: data.listingId },
            select: {
                id: true,
                title: true,
                ownerId: true,
                status: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId !== userId) {
            throw new common_1.ForbiddenException('You can only create proposals for your own listings');
        }
        if (listing.status !== 'LIVE') {
            throw new common_1.BadRequestException('Cannot create proposals for inactive listings');
        }
        const startsAt = new Date(data.startsAt);
        const endsAt = new Date(data.endsAt);
        const now = new Date();
        if (startsAt <= now) {
            throw new common_1.BadRequestException('Start date must be in the future');
        }
        if (endsAt <= startsAt) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        if (endsAt <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
            throw new common_1.BadRequestException('Voting period must be at least 24 hours');
        }
        const proposal = await this.votesRepository.createProposal({
            data: {
                listingId: data.listingId,
                title: data.title,
                description: data.description,
                startsAt,
                endsAt,
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
                _count: {
                    select: {
                        votes: true,
                    },
                },
            },
        });
        this.logger.log(`Proposal created: ${proposal.title} for listing ${listing.title}`);
        return proposal;
    }
    async getProposals(query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [proposals, total] = await Promise.all([
            this.votesRepository.findProposals({
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
                    _count: {
                        select: {
                            votes: true,
                        },
                    },
                },
            }),
            this.votesRepository.countProposals(),
        ]);
        return {
            data: proposals,
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
    async getProposal(id) {
        const proposal = await this.votesRepository.findProposal({
            where: { id },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        locationText: true,
                        parcelSize: true,
                        totalShares: true,
                    },
                },
                votes: {
                    select: {
                        id: true,
                        choice: true,
                        weightDecimal: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: {
                        votes: true,
                    },
                },
            },
        });
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        return proposal;
    }
    async getProposalResults(id) {
        const proposal = await this.votesRepository.findProposal({
            where: { id },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        totalShares: true,
                    },
                },
                votes: {
                    select: {
                        choice: true,
                        weightDecimal: true,
                    },
                },
            },
        });
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        const results = proposal.votes.reduce((acc, vote) => {
            if (vote.choice === 'YES') {
                acc.yesWeight = acc.yesWeight + Number(vote.weightDecimal);
            }
            else {
                acc.noWeight = acc.noWeight + Number(vote.weightDecimal);
            }
            return acc;
        }, { yesWeight: 0, noWeight: 0 });
        const totalWeight = results.yesWeight + results.noWeight;
        const turnout = proposal.listing.totalShares > 0 ? (totalWeight / proposal.listing.totalShares) * 100 : 0;
        return {
            proposal: {
                id: proposal.id,
                title: proposal.title,
                status: proposal.status,
                startsAt: proposal.startsAt,
                endsAt: proposal.endsAt,
            },
            results: {
                yesWeight: results.yesWeight,
                noWeight: results.noWeight,
                totalWeight,
                turnout: Math.round(turnout * 100) / 100,
                winner: results.yesWeight > results.noWeight ? 'YES' : results.noWeight > results.yesWeight ? 'NO' : 'TIE',
            },
            listing: proposal.listing,
        };
    }
    async castVote(userId, data) {
        const proposal = await this.votesRepository.findProposal({
            where: { id: data.proposalId },
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
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        if (proposal.status !== 'OPEN') {
            throw new common_1.BadRequestException('Proposal is not open for voting');
        }
        if (proposal.listing.status !== 'LIVE') {
            throw new common_1.BadRequestException('Cannot vote on proposals for inactive listings');
        }
        const now = new Date();
        if (now < proposal.startsAt || now > proposal.endsAt) {
            throw new common_1.BadRequestException('Voting period is not active');
        }
        const existingVote = await this.votesRepository.findVote({
            where: {
                proposalId: data.proposalId,
                userId,
            },
        });
        if (existingVote) {
            throw new common_1.BadRequestException('You have already voted on this proposal');
        }
        const votingWeight = await this.calculateVotingWeight(userId, proposal.listingId);
        if (votingWeight <= 0) {
            throw new common_1.BadRequestException('You must own shares to vote on this proposal');
        }
        const vote = await this.votesRepository.upsertVote({
            where: {
                proposalId_userId: {
                    proposalId: data.proposalId,
                    userId,
                },
            },
            create: {
                proposalId: data.proposalId,
                userId,
                choice: data.choice,
                weightDecimal: votingWeight,
            },
            update: {
                choice: data.choice,
                weightDecimal: votingWeight,
            },
            include: {
                proposal: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        this.logger.log(`Vote cast: ${data.choice} by user ${userId} with weight ${votingWeight}`);
        return vote;
    }
    async getUserVotes(userId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const [votes, total] = await Promise.all([
            this.votesRepository.findVotes({
                where: { userId },
                skip,
                take: limit,
                orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
                include: {
                    proposal: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            status: true,
                            startsAt: true,
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
            }),
            this.votesRepository.countVotes({ where: { userId } }),
        ]);
        return {
            data: votes,
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
    async getUserVoteForProposal(userId, proposalId) {
        const vote = await this.votesRepository.findVote({
            where: {
                proposalId,
                userId,
            },
            include: {
                proposal: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        startsAt: true,
                        endsAt: true,
                    },
                },
            },
        });
        if (!vote) {
            throw new common_1.NotFoundException('Vote not found');
        }
        return vote;
    }
    async closeProposal(id) {
        const proposal = await this.votesRepository.findProposal({
            where: { id },
            select: { id: true, title: true, status: true },
        });
        if (!proposal) {
            throw new common_1.NotFoundException('Proposal not found');
        }
        if (proposal.status !== 'OPEN') {
            throw new common_1.BadRequestException('Proposal is already closed');
        }
        const updatedProposal = await this.votesRepository.updateProposal({
            where: { id },
            data: { status: 'CLOSED' },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        this.logger.log(`Proposal closed: ${updatedProposal.title}`);
        return updatedProposal;
    }
    async getStats() {
        const [totalProposals, openProposals, closedProposals, totalVotes,] = await Promise.all([
            this.votesRepository.countProposals(),
            this.votesRepository.countProposals({ where: { status: 'OPEN' } }),
            this.votesRepository.countProposals({ where: { status: 'CLOSED' } }),
            this.votesRepository.countVotes(),
        ]);
        return {
            proposals: {
                total: totalProposals,
                open: openProposals,
                closed: closedProposals,
            },
            votes: {
                total: totalVotes,
            },
        };
    }
    async calculateVotingWeight(userId, listingId) {
        try {
            const mockWeight = Math.floor(Math.random() * 10) + 1;
            this.logger.log(`Calculated voting weight for user ${userId} on listing ${listingId}: ${mockWeight}`);
            return mockWeight;
        }
        catch (error) {
            this.logger.error(`Failed to calculate voting weight for user ${userId}:`, error);
            return 0;
        }
    }
};
exports.VotesService = VotesService;
exports.VotesService = VotesService = VotesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [votes_repository_1.VotesRepository,
        listings_repository_1.ListingsRepository, Object])
], VotesService);
//# sourceMappingURL=votes.service.js.map