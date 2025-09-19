import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class VotesRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findProposals(args?: Prisma.ProposalFindManyArgs): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.ProposalStatus;
        listingId: string;
        startsAt: Date;
        endsAt: Date;
    }[]>;
    findProposal(args: Prisma.ProposalFindUniqueArgs): Promise<{
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
    createProposal(args: Prisma.ProposalCreateArgs): Promise<{
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
    updateProposal(args: Prisma.ProposalUpdateArgs): Promise<{
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
    deleteProposal(args: Prisma.ProposalDeleteArgs): Promise<{
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
    countProposals(args?: Prisma.ProposalCountArgs): Promise<number>;
    findVotes(args?: Prisma.VoteFindManyArgs): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: Prisma.Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }[]>;
    findVote(args: Prisma.VoteFindUniqueArgs): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: Prisma.Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    createVote(args: Prisma.VoteCreateArgs): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: Prisma.Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    updateVote(args: Prisma.VoteUpdateArgs): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: Prisma.Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    upsertVote(args: Prisma.VoteUpsertArgs): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: Prisma.Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    deleteVote(args: Prisma.VoteDeleteArgs): Promise<{
        id: string;
        createdAt: Date;
        weightDecimal: Prisma.Decimal;
        choice: import("@prisma/client").$Enums.VoteChoice;
        proposalId: string;
        userId: string;
    }>;
    countVotes(args?: Prisma.VoteCountArgs): Promise<number>;
}
