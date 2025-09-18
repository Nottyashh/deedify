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

import { PayoutsService } from './payouts.service';
import { JwtAuthGuard, AdminGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const TriggerPayoutDto = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  reason: z.enum(['DIVIDEND', 'BUYOUT'], { required_error: 'Reason is required' }),
  amount: z.number().positive('Amount must be positive').optional(),
});

type TriggerPayoutDto = z.infer<typeof TriggerPayoutDto>;

@ApiTags('payouts')
@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post('trigger')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger payout distribution (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payout triggered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async triggerPayout(
    @Body(new ZodValidationPipe(TriggerPayoutDto)) triggerPayoutDto: TriggerPayoutDto,
  ) {
    return this.payoutsService.triggerPayout(triggerPayoutDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payouts' })
  @ApiResponse({ status: 200, description: 'Payouts retrieved successfully' })
  async getPayouts(
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.payoutsService.getPayouts(query);
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'Get payouts for a listing' })
  @ApiResponse({ status: 200, description: 'Payouts retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async getListingPayouts(
    @Param('listingId') listingId: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.payoutsService.getListingPayouts(listingId, query);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user payouts' })
  @ApiResponse({ status: 200, description: 'User payouts retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPayouts(
    @Param('userId') userId: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.payoutsService.getUserPayouts(userId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payout statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.payoutsService.getStats();
  }
}