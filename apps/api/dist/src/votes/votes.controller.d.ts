import { z } from 'zod';
import { VotesService } from './votes.service';
import { PaginationDto } from '../common/dto/pagination.dto';
declare const CreateProposalDto: z.ZodObject<{
    listingId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    startsAt: z.ZodString;
    endsAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
    listingId?: string;
    startsAt?: string;
    endsAt?: string;
}, {
    title?: string;
    description?: string;
    listingId?: string;
    startsAt?: string;
    endsAt?: string;
}>;
declare const VoteDto: z.ZodObject<{
    proposalId: z.ZodString;
    choice: z.ZodEnum<["YES", "NO"]>;
}, "strip", z.ZodTypeAny, {
    choice?: "YES" | "NO";
    proposalId?: string;
}, {
    choice?: "YES" | "NO";
    proposalId?: string;
}>;
type CreateProposalDto = z.infer<typeof CreateProposalDto>;
type VoteDto = z.infer<typeof VoteDto>;
export declare class VotesController {
    private readonly votesService;
    constructor(votesService: VotesService);
    createProposal(req: any, createProposalDto: CreateProposalDto): Promise<{
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
    getProposals(query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
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
    castVote(req: any, voteDto: VoteDto): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: import("@prisma/client/runtime/library").Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    getUserVotes(req: any, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getUserVoteForProposal(req: any, proposalId: string): Promise<{
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
}
export {};
