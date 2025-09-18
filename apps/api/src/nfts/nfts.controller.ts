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

import { NftsService } from './nfts.service';
import { JwtAuthGuard, ListerGuard, AdminGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const MintCollectionDto = z.object({
  listingId: z.string().cuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  image: z.string().url().optional(),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.union([z.string(), z.number()]),
  })).optional(),
});

const MintFractionsDto = z.object({
  listingId: z.string().cuid(),
  totalShares: z.number().int().min(1).max(10000),
  baseName: z.string().min(1).max(100),
  baseDescription: z.string().min(1).max(1000),
  image: z.string().url().optional(),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.union([z.string(), z.number()]),
  })).optional(),
});

type MintCollectionDto = z.infer<typeof MintCollectionDto>;
type MintFractionsDto = z.infer<typeof MintFractionsDto>;

@ApiTags('nfts')
@Controller('nfts')
export class NftsController {
  constructor(private readonly nftsService: NftsService) {}

  @Post('collection')
  @UseGuards(JwtAuthGuard, ListerGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Mint collection NFT for a listing' })
  @ApiResponse({ status: 201, description: 'Collection NFT minted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async mintCollection(
    @Request() req,
    @Body(new ZodValidationPipe(MintCollectionDto)) mintCollectionDto: MintCollectionDto,
  ) {
    return this.nftsService.mintCollection(req.user.sub, mintCollectionDto);
  }

  @Post('fractions')
  @UseGuards(JwtAuthGuard, ListerGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Mint fractional NFTs for a listing' })
  @ApiResponse({ status: 201, description: 'Fractional NFTs minted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async mintFractions(
    @Request() req,
    @Body(new ZodValidationPipe(MintFractionsDto)) mintFractionsDto: MintFractionsDto,
  ) {
    return this.nftsService.mintFractions(req.user.sub, mintFractionsDto);
  }

  @Get('collection/:listingId')
  @ApiOperation({ summary: 'Get collection NFT for a listing' })
  @ApiResponse({ status: 200, description: 'Collection NFT retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async getCollection(@Param('listingId') listingId: string) {
    return this.nftsService.getCollection(listingId);
  }

  @Get('fractions/:listingId')
  @ApiOperation({ summary: 'Get fractional NFTs for a listing' })
  @ApiResponse({ status: 200, description: 'Fractional NFTs retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async getFractions(
    @Param('listingId') listingId: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.nftsService.getFractions(listingId, query);
  }

  @Get('metadata/:mintAddress')
  @ApiOperation({ summary: 'Get NFT metadata by mint address' })
  @ApiResponse({ status: 200, description: 'NFT metadata retrieved successfully' })
  @ApiResponse({ status: 404, description: 'NFT not found' })
  async getMetadata(@Param('mintAddress') mintAddress: string) {
    return this.nftsService.getMetadata(mintAddress);
  }

  @Get('owner/:walletAddress')
  @ApiOperation({ summary: 'Get NFTs owned by wallet address' })
  @ApiResponse({ status: 200, description: 'Owned NFTs retrieved successfully' })
  async getOwnedNfts(
    @Param('walletAddress') walletAddress: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.nftsService.getOwnedNfts(walletAddress, query);
  }

  @Post('verify/:listingId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify collection authority (Admin only)' })
  @ApiResponse({ status: 200, description: 'Collection verified successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async verifyCollection(@Param('listingId') listingId: string) {
    return this.nftsService.verifyCollection(listingId);
  }

  @Get('stats/:listingId')
  @ApiOperation({ summary: 'Get NFT statistics for a listing' })
  @ApiResponse({ status: 200, description: 'NFT statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async getStats(@Param('listingId') listingId: string) {
    return this.nftsService.getStats(listingId);
  }
}