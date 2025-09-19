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

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const CreateOrderDto = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  fractions: z.number().int().min(1, 'Must purchase at least 1 fraction'),
});

const PayOrderDto = z.object({
  walletAddress: z.string().optional(),
});

type CreateOrderDto = z.infer<typeof CreateOrderDto>;
type PayOrderDto = z.infer<typeof PayOrderDto>;

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(CreateOrderDto)) createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user.sub, createOrderDto);
  }

  @Post(':id/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process payment for an order' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async pay(
    @Param('id') id: string,
    @Request() req,
    @Body(new ZodValidationPipe(PayOrderDto)) payOrderDto: PayOrderDto,
  ) {
    return this.ordersService.pay(id, req.user.sub, payOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getUserOrders(
    @Request() req,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.ordersService.getUserOrders(req.user.sub, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getById(@Param('id') id: string, @Request() req) {
    return this.ordersService.getById(id, req.user.sub);
  }
}