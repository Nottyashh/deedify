import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';

import { VotesService } from './votes.service';
import { JwtAuthGuard, ListerGuard, AdminGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const CreateProposalDto = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  startsAt: z.string().datetime('Invalid start date'),
  endsAt: z.string().datetime('Invalid end date'),
});

const VoteDto = z.object({
  proposalId: z.string().cuid('Invalid proposal ID'),
  choice: z.enum(['YES', 'NO'], { required_error: 'Choice is required' }),
});

type CreateProposalDto = z.infer<typeof CreateProposalDto>;
type VoteDto = z.infer<typeof VoteDto>;

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post('proposals')
  @UseGuards(JwtAuthGuard, ListerGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new proposal' })
  @ApiResponse({ status: 201, description: 'Proposal created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async createProposal(
    @Request() req,
    @Body(new ZodValidationPipe(CreateProposalDto)) createProposalDto: CreateProposalDto,
  ) {
    return this.votesService.createProposal(req.user.sub, createProposalDto);
  }

  @Get('proposals')
  @ApiOperation({ summary: 'Get all proposals' })
  @ApiResponse({ status: 200, description: 'Proposals retrieved successfully' })
  async getProposals(
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.votesService.getProposals(query);
  }

  @Get('proposals/:id')
  @ApiOperation({ summary: 'Get proposal by ID' })
  @ApiResponse({ status: 200, description: 'Proposal retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async getProposal(@Param('id') id: string) {
    return this.votesService.getProposal(id);
  }

  @Get('proposals/:id/results')
  @ApiOperation({ summary: 'Get proposal voting results' })
  @ApiResponse({ status: 200, description: 'Voting results retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async getProposalResults(@Param('id') id: string) {
    return this.votesService.getProposalResults(id);
  }

  @Post('vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cast a vote on a proposal' })
  @ApiResponse({ status: 200, description: 'Vote cast successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async castVote(
    @Request() req,
    @Body(new ZodValidationPipe(VoteDto)) voteDto: VoteDto,
  ) {
    return this.votesService.castVote(req.user.sub, voteDto);
  }

  @Get('my-votes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user votes' })
  @ApiResponse({ status: 200, description: 'User votes retrieved successfully' })
  async getUserVotes(
    @Request() req,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.votesService.getUserVotes(req.user.sub, query);
  }

  @Get('proposals/:id/my-vote')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user vote for a specific proposal' })
  @ApiResponse({ status: 200, description: 'User vote retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async getUserVoteForProposal(
    @Request() req,
    @Param('id') proposalId: string,
  ) {
    return this.votesService.getUserVoteForProposal(req.user.sub, proposalId);
  }

  @Post('proposals/:id/close')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Close a proposal (Admin only)' })
  @ApiResponse({ status: 200, description: 'Proposal closed successfully' })
  @ApiResponse({ status: 404, description: 'Proposal not found' })
  async closeProposal(@Param('id') id: string) {
    return this.votesService.closeProposal(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get voting statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.votesService.getStats();
  }
}