import { VotesRepository } from './votes.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
export declare class VotesService {
    private readonly votesRepository;
    private readonly listingsRepository;
    private readonly solanaService;
    private readonly logger;
    constructor(votesRepository: VotesRepository, listingsRepository: ListingsRepository, solanaService: any);
    createProposal(userId: string, data: {
        listingId: string;
        title: string;
        description: string;
        startsAt: string;
        endsAt: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProposalStatus;
        listingId: string;
        startsAt: Date;
        endsAt: Date;
    }>;
    getProposals(query: PaginationDto): Promise<PaginatedResponse<any>>;
    getProposal(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProposalStatus;
        listingId: string;
        startsAt: Date;
        endsAt: Date;
    }>;
    getProposalResults(id: string): Promise<{
        proposal: {
            id: string;
            title: string;
            status: import("@prisma/client").$Enums.ProposalStatus;
            startsAt: Date;
            endsAt: Date;
        };
        results: {
            yesWeight: any;
            noWeight: any;
            totalWeight: any;
            turnout: number;
            winner: string;
        };
        listing: any;
    }>;
    castVote(userId: string, data: {
        proposalId: string;
        choice: 'YES' | 'NO';
    }): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: import("@prisma/client/runtime/library").Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    getUserVotes(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getUserVoteForProposal(userId: string, proposalId: string): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: import("@prisma/client/runtime/library").Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    closeProposal(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProposalStatus;
        listingId: string;
        startsAt: Date;
        endsAt: Date;
    }>;
    getStats(): Promise<{
        proposals: {
            total: number;
            open: number;
            closed: number;
        };
        votes: {
            total: number;
        };
    }>;
    private calculateVotingWeight;
}
