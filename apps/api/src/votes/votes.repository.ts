import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class VotesRepository {
  constructor(private prisma: PrismaService) {}

  async findProposals(args?: Prisma.ProposalFindManyArgs) {
    return this.prisma.proposal.findMany(args);
  }

  async findProposal(args: Prisma.ProposalFindUniqueArgs) {
    return this.prisma.proposal.findUnique(args);
  }

  async createProposal(args: Prisma.ProposalCreateArgs) {
    return this.prisma.proposal.create(args);
  }

  async updateProposal(args: Prisma.ProposalUpdateArgs) {
    return this.prisma.proposal.update(args);
  }

  async deleteProposal(args: Prisma.ProposalDeleteArgs) {
    return this.prisma.proposal.delete(args);
  }

  async countProposals(args?: Prisma.ProposalCountArgs) {
    return this.prisma.proposal.count(args);
  }

  async findVotes(args?: Prisma.VoteFindManyArgs) {
    return this.prisma.vote.findMany(args);
  }

  async findVote(args: Prisma.VoteFindUniqueArgs) {
    return this.prisma.vote.findUnique(args);
  }

  async createVote(args: Prisma.VoteCreateArgs) {
    return this.prisma.vote.create(args);
  }

  async updateVote(args: Prisma.VoteUpdateArgs) {
    return this.prisma.vote.update(args);
  }

  async upsertVote(args: Prisma.VoteUpsertArgs) {
    return this.prisma.vote.upsert(args);
  }

  async deleteVote(args: Prisma.VoteDeleteArgs) {
    return this.prisma.vote.delete(args);
  }

  async countVotes(args?: Prisma.VoteCountArgs) {
    return this.prisma.vote.count(args);
  }
}