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
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';

import { ListingsService } from './listings.service';
import { JwtAuthGuard, ListerGuard, AdminGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const CreateListingDto = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  locationText: z.string().min(1).max(500),
  geoJson: z.any().optional(), // GeoJSON object
  parcelSize: z.number().positive(),
  coordinatePolicy: z.boolean().default(true),
  coordinatePolicyNote: z.string().optional(),
  totalShares: z.number().int().min(1).max(10000).default(100),
  pricePerShare: z.number().positive(),
});

const UpdateListingDto = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  locationText: z.string().min(1).max(500).optional(),
  geoJson: z.any().optional(),
  parcelSize: z.number().positive().optional(),
  coordinatePolicy: z.boolean().optional(),
  coordinatePolicyNote: z.string().optional(),
  totalShares: z.number().int().min(1).max(10000).optional(),
  pricePerShare: z.number().positive().optional(),
  status: z.enum(['PENDING', 'LIVE', 'PAUSED', 'CLOSED']).optional(),
});

const SearchListingsDto = z.object({
  ...PaginationDto.shape,
  search: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minSize: z.number().positive().optional(),
  maxSize: z.number().positive().optional(),
  status: z.enum(['PENDING', 'LIVE', 'PAUSED', 'CLOSED']).optional(),
});

type CreateListingDto = z.infer<typeof CreateListingDto>;
type UpdateListingDto = z.infer<typeof UpdateListingDto>;
type SearchListingsDto = z.infer<typeof SearchListingsDto>;

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, ListerGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiResponse({ status: 201, description: 'Listing created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateListingDto)) createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(req.user.sub, createListingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all listings with search and filters' })
  @ApiResponse({ status: 200, description: 'Listings retrieved successfully' })
  async findAll(@Query(new ZodValidationPipe(SearchListingsDto)) query: SearchListingsDto) {
    return this.listingsService.findAll(query);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public listings (no auth required)' })
  @ApiResponse({ status: 200, description: 'Public listings retrieved successfully' })
  async findPublic(@Query(new ZodValidationPipe(SearchListingsDto)) query: SearchListingsDto) {
    return this.listingsService.findPublic(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing' })
  @ApiResponse({ status: 200, description: 'Listing updated successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body(new ZodValidationPipe(UpdateListingDto)) updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, req.user.sub, updateListingDto);
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update listing status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Listing status updated successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'LIVE' | 'PAUSED' | 'CLOSED' },
  ) {
    return this.listingsService.updateStatus(id, body.status);
  }

  @Get(':id/shares')
  @ApiOperation({ summary: 'Get listing share tokens' })
  @ApiResponse({ status: 200, description: 'Share tokens retrieved successfully' })
  async getShares(@Param('id') id: string) {
    return this.listingsService.getShares(id);
  }

  @Get(':id/valuation')
  @ApiOperation({ summary: 'Get listing valuation' })
  @ApiResponse({ status: 200, description: 'Valuation retrieved successfully' })
  async getValuation(@Param('id') id: string) {
    return this.listingsService.getValuation(id);
  }

  @Post(':id/valuation')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger valuation update (Admin only)' })
  @ApiResponse({ status: 200, description: 'Valuation updated successfully' })
  async updateValuation(@Param('id') id: string) {
    return this.listingsService.updateValuation(id);
  }
}