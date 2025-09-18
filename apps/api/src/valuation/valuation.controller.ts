import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';

import { ValuationService } from './valuation.service';
import { JwtAuthGuard, AdminGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';

const EstimateValueDto = z.object({
  location: z.string().min(1, 'Location is required'),
  parcelSize: z.number().positive('Parcel size must be positive'),
  geoJson: z.any().optional(),
  comps: z.array(z.object({
    location: z.string(),
    size: z.number(),
    price: z.number(),
  })).optional(),
  soilScore: z.number().min(0).max(100).optional(),
  infraScore: z.number().min(0).max(100).optional(),
});

type EstimateValueDto = z.infer<typeof EstimateValueDto>;

@ApiTags('valuation')
@Controller('valuation')
export class ValuationController {
  constructor(private readonly valuationService: ValuationService) {}

  @Post('estimate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Estimate property value' })
  @ApiResponse({ status: 200, description: 'Valuation estimated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async estimateValue(
    @Body(new ZodValidationPipe(EstimateValueDto)) estimateValueDto: EstimateValueDto,
  ) {
    return this.valuationService.estimateValue(estimateValueDto);
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'Get valuation for a listing' })
  @ApiResponse({ status: 200, description: 'Valuation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async getListingValuation(@Param('listingId') listingId: string) {
    return this.valuationService.getListingValuation(listingId);
  }

  @Post('refresh/:listingId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh valuation for a listing (Admin only)' })
  @ApiResponse({ status: 200, description: 'Valuation refreshed successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async refreshValuation(@Param('listingId') listingId: string) {
    return this.valuationService.refreshValuation(listingId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get valuation statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.valuationService.getStats();
  }
}