import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';

import { HoldingsService } from './holdings.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const GetHoldingsDto = z.object({
  ...PaginationDto.shape,
  userId: z.string().optional(),
});

type GetHoldingsDto = z.infer<typeof GetHoldingsDto>;

@ApiTags('holdings')
@Controller('holdings')
export class HoldingsController {
  constructor(private readonly holdingsService: HoldingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user holdings' })
  @ApiResponse({ status: 200, description: 'Holdings retrieved successfully' })
  async getUserHoldings(
    @Request() req,
    @Query(new ZodValidationPipe(GetHoldingsDto)) query: GetHoldingsDto,
  ) {
    // Use userId from query if provided, otherwise use authenticated user
    const userId = query.userId || req.user.sub;
    return this.holdingsService.getUserHoldings(userId, query);
  }
}