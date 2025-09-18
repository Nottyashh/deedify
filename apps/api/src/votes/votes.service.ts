import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { VotesRepository } from './votes.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class VotesService {
  private readonly logger = new Logger(VotesService.name);

  constructor(
    private readonly votesRepository: VotesRepository,
    private readonly listingsRepository: ListingsRepository,
    private readonly solanaService: any,
  ) {}

  async createProposal(userId: string, data: {
    listingId: string;
    title: string;
    description: string;
    startsAt: string;
    endsAt: string;
  }) {
    // Verify listing exists and user has permission
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
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== userId) {
      throw new ForbiddenException('You can only create proposals for your own listings');
    }

    if (listing.status !== 'LIVE') {
      throw new BadRequestException('Cannot create proposals for inactive listings');
    }

    // Validate dates
    const startsAt = new Date(data.startsAt);
    const endsAt = new Date(data.endsAt);
    const now = new Date();

    if (startsAt <= now) {
      throw new BadRequestException('Start date must be in the future');
    }

    if (endsAt <= startsAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (endsAt <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      throw new BadRequestException('Voting period must be at least 24 hours');
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

  async getProposals(query: PaginationDto): Promise<PaginatedResponse<any>> {
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

  async getProposal(id: string) {
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
      throw new NotFoundException('Proposal not found');
    }

    return proposal;
  }

  async getProposalResults(id: string) {
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
      throw new NotFoundException('Proposal not found');
    }

    // Calculate results
    const results = proposal.votes.reduce(
      (acc, vote) => {
        if (vote.choice === 'YES') {
          acc.yesWeight = acc.yesWeight + Number(vote.weightDecimal);
        } else {
          acc.noWeight = acc.noWeight + Number(vote.weightDecimal);
        }
        return acc;
      },
      { yesWeight: 0, noWeight: 0 }
    );

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

  async castVote(userId: string, data: {
    proposalId: string;
    choice: 'YES' | 'NO';
  }) {
    // Verify proposal exists and is open
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
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.status !== 'OPEN') {
      throw new BadRequestException('Proposal is not open for voting');
    }

    if (proposal.listing.status !== 'LIVE') {
      throw new BadRequestException('Cannot vote on proposals for inactive listings');
    }

    const now = new Date();
    if (now < proposal.startsAt || now > proposal.endsAt) {
      throw new BadRequestException('Voting period is not active');
    }

    // Check if user already voted
    const existingVote = await this.votesRepository.findVote({
      where: {
        proposalId: data.proposalId,
        userId,
      },
    });

    if (existingVote) {
      throw new BadRequestException('You have already voted on this proposal');
    }

    // Calculate voting weight based on share ownership
    const votingWeight = await this.calculateVotingWeight(userId, proposal.listingId);

    if (votingWeight <= 0) {
      throw new BadRequestException('You must own shares to vote on this proposal');
    }

    // Create or update vote
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

  async getUserVotes(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
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

  async getUserVoteForProposal(userId: string, proposalId: string) {
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
      throw new NotFoundException('Vote not found');
    }

    return vote;
  }

  async closeProposal(id: string) {
    const proposal = await this.votesRepository.findProposal({
      where: { id },
      select: { id: true, title: true, status: true },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.status !== 'OPEN') {
      throw new BadRequestException('Proposal is already closed');
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
    const [
      totalProposals,
      openProposals,
      closedProposals,
      totalVotes,
    ] = await Promise.all([
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

  private async calculateVotingWeight(userId: string, listingId: string): Promise<number> {
    // This would typically query on-chain data via Helius to get real-time ownership
    // For now, we'll use a placeholder implementation
    
    try {
      // In a real implementation, you would:
      // 1. Get user's wallet address
      // 2. Query Helius for all NFTs owned by that wallet
      // 3. Filter for NFTs that belong to this listing
      // 4. Count the total shares owned
      
      // Placeholder: return a random weight for demo purposes
      const mockWeight = Math.floor(Math.random() * 10) + 1;
      
      this.logger.log(`Calculated voting weight for user ${userId} on listing ${listingId}: ${mockWeight}`);
      
      return mockWeight;
    } catch (error) {
      this.logger.error(`Failed to calculate voting weight for user ${userId}:`, error);
      return 0;
    }
  }
}