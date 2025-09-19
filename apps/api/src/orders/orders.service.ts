import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { HoldingsService } from '../holdings/holdings.service';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly listingsRepository: ListingsRepository,
    private readonly holdingsService: HoldingsService,
  ) {}

  async create(userId: string, data: {
    listingId: string;
    fractions: number;
  }) {
    // Verify listing exists and is active
    const listing = await this.listingsRepository.findUnique({
      where: { id: data.listingId },
      select: {
        id: true,
        title: true,
        status: true,
        totalShares: true,
        pricePerShare: true,
        _count: {
          select: {
            shareTokens: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== 'LIVE') {
      throw new BadRequestException('Listing is not available for purchase');
    }

    // Check if enough shares are available
    const availableShares = listing.totalShares - listing._count.shareTokens;
    if (data.fractions > availableShares) {
      throw new BadRequestException(`Only ${availableShares} shares available`);
    }

    // Calculate total price
    const totalPrice = Number(listing.pricePerShare) * data.fractions;

    // Create order
    const order = await this.ordersRepository.create({
      data: {
        type: 'BUY',
        listingId: data.listingId,
        shareMint: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`, // Temporary until NFT is minted
        buyerId: userId,
        price: totalPrice,
        status: 'OPEN',
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            locationText: true,
            pricePerShare: true,
          },
        },
      },
    });

    this.logger.log(`Order created: ${order.id} for ${data.fractions} shares of ${listing.title}`);

    return {
      ...order,
      fractions: data.fractions,
      totalPrice,
    };
  }

  async pay(orderId: string, userId: string, data: { walletAddress?: string }) {
    // Find order
    const order = await this.ordersRepository.findUnique({
      where: { id: orderId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            pricePerShare: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.buyerId !== userId) {
      throw new ForbiddenException('You can only pay for your own orders');
    }

    if (order.status !== 'OPEN') {
      throw new BadRequestException('Order is not available for payment');
    }

    // Check if mock escrow is enabled
    const useMockEscrow = process.env.USE_MOCK_ESCROW === 'true';

    if (useMockEscrow) {
      // Mock payment success
      const updatedOrder = await this.ordersRepository.update({
        where: { id: orderId },
        data: {
          status: 'FILLED',
          txSignature: `mock_tx_${Date.now()}`,
        },
        include: {
          listing: true,
        },
      });

      // Calculate fractions from price
      const fractions = Math.round(order.price / Number(order.listing.pricePerShare));

      // Create or update holding
      await this.holdingsService.createOrUpdateHolding({
        userId,
        listingId: order.listingId,
        shares: fractions,
        totalInvested: order.price,
      });

      this.logger.log(`Mock payment processed for order ${orderId}`);

      return {
        success: true,
        transactionSignature: updatedOrder.txSignature,
        message: 'Payment processed successfully (mock)',
      };
    }

    // TODO: Implement actual Solana transaction with Anchor
    // For now, return transaction data for frontend to handle
    const transactionData = {
      // This would be the actual transaction data from Anchor
      programId: process.env.ORCHESTRATOR_PROGRAM_ID,
      accounts: {
        // Account keys would go here
      },
      data: {
        orderId,
        amount: order.price,
        listingId: order.listingId,
      },
    };

    // Alternative: Return Phantom deep link
    const deepLink = `https://phantom.app/ul/v1/signTransaction?dapp_encryption_public_key=mock&nonce=mock&redirect_link=http://localhost:3000/orders/${orderId}/success&transaction=mock`;

    return {
      transactionData,
      deepLink,
      message: 'Complete payment in your wallet',
    };
  }

  async getUserOrders(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.ordersRepository.findMany({
        where: {
          OR: [
            { buyerId: userId },
            { sellerId: userId },
          ],
        },
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              locationText: true,
              pricePerShare: true,
            },
          },
        },
      }),
      this.ordersRepository.count({
        where: {
          OR: [
            { buyerId: userId },
            { sellerId: userId },
          ],
        },
      }),
    ]);

    return {
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getById(id: string, userId: string) {
    const order = await this.ordersRepository.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            locationText: true,
            parcelSize: true,
            pricePerShare: true,
          },
        },
        buyer: {
          select: {
            id: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user has access to this order
    if (order.buyerId !== userId && order.sellerId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }
}