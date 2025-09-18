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

import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const ListShareDto = z.object({
  shareMint: z.string().min(1, 'Share mint address is required'),
  price: z.number().positive('Price must be positive'),
});

const BuyShareDto = z.object({
  shareMint: z.string().min(1, 'Share mint address is required'),
  buyerWallet: z.string().min(1, 'Buyer wallet address is required'),
});

const SellShareDto = z.object({
  shareMint: z.string().min(1, 'Share mint address is required'),
  price: z.number().positive('Price must be positive'),
});

const CancelOrderDto = z.object({
  orderId: z.string().cuid('Invalid order ID'),
});

type ListShareDto = z.infer<typeof ListShareDto>;
type BuyShareDto = z.infer<typeof BuyShareDto>;
type SellShareDto = z.infer<typeof SellShareDto>;
type CancelOrderDto = z.infer<typeof CancelOrderDto>;

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'List a share for sale' })
  @ApiResponse({ status: 201, description: 'Share listed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Share not found' })
  async listShare(
    @Request() req,
    @Body(new ZodValidationPipe(ListShareDto)) listShareDto: ListShareDto,
  ) {
    return this.marketplaceService.listShare(req.user.sub, listShareDto);
  }

  @Post('buy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buy a share' })
  @ApiResponse({ status: 200, description: 'Share purchased successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Share or order not found' })
  async buyShare(
    @Request() req,
    @Body(new ZodValidationPipe(BuyShareDto)) buyShareDto: BuyShareDto,
  ) {
    return this.marketplaceService.buyShare(req.user.sub, buyShareDto);
  }

  @Post('sell')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sell a share' })
  @ApiResponse({ status: 200, description: 'Share sold successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Share not found' })
  async sellShare(
    @Request() req,
    @Body(new ZodValidationPipe(SellShareDto)) sellShareDto: SellShareDto,
  ) {
    return this.marketplaceService.sellShare(req.user.sub, sellShareDto);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async cancelOrder(
    @Request() req,
    @Body(new ZodValidationPipe(CancelOrderDto)) cancelOrderDto: CancelOrderDto,
  ) {
    return this.marketplaceService.cancelOrder(req.user.sub, cancelOrderDto);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getUserOrders(
    @Request() req,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.marketplaceService.getUserOrders(req.user.sub, query);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('id') id: string) {
    return this.marketplaceService.getOrder(id);
  }

  @Get('listings')
  @ApiOperation({ summary: 'Get active marketplace listings' })
  @ApiResponse({ status: 200, description: 'Listings retrieved successfully' })
  async getListings(
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.marketplaceService.getListings(query);
  }

  @Get('listings/:listingId/shares')
  @ApiOperation({ summary: 'Get available shares for a listing' })
  @ApiResponse({ status: 200, description: 'Shares retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async getListingShares(
    @Param('listingId') listingId: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.marketplaceService.getListingShares(listingId, query);
  }

  @Get('history/:shareMint')
  @ApiOperation({ summary: 'Get trading history for a share' })
  @ApiResponse({ status: 200, description: 'Trading history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Share not found' })
  async getShareHistory(
    @Param('shareMint') shareMint: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.marketplaceService.getShareHistory(shareMint, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get marketplace statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.marketplaceService.getStats();
  }
}