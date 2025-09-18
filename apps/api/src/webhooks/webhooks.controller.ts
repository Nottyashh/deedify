import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { WebhooksService } from './webhooks.service';

interface HeliusWebhookPayload {
  type: 'TRANSFER' | 'NFT_SALE' | 'NFT_MINT' | 'NFT_BURN';
  signature: string;
  slot: number;
  timestamp: number;
  data: any;
}

interface KycWebhookPayload {
  event: 'verification_completed' | 'verification_failed';
  verification_id: string;
  status: 'approved' | 'declined';
  user_id: string;
  data: any;
}

interface StripeWebhookPayload {
  type: string;
  data: {
    object: any;
  };
}

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('helius')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Helius webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleHeliusWebhook(
    @Body() payload: HeliusWebhookPayload,
    @Headers('authorization') authHeader: string,
  ) {
    // Verify webhook signature
    if (!this.verifyHeliusSignature(authHeader, payload)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Received Helius webhook: ${payload.type} - ${payload.signature}`);

    try {
      await this.webhooksService.processHeliusWebhook(payload);
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Failed to process Helius webhook:', error);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  @Post('kyc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle KYC webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleKycWebhook(
    @Body() payload: KycWebhookPayload,
    @Headers('authorization') authHeader: string,
  ) {
    // Verify webhook signature
    if (!this.verifyKycSignature(authHeader, payload)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Received KYC webhook: ${payload.event} - ${payload.verification_id}`);

    try {
      await this.webhooksService.processKycWebhook(payload);
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Failed to process KYC webhook:', error);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleStripeWebhook(
    @Body() payload: StripeWebhookPayload,
    @Headers('stripe-signature') signature: string,
  ) {
    // Verify webhook signature
    if (!this.verifyStripeSignature(signature, payload)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Received Stripe webhook: ${payload.type}`);

    try {
      await this.webhooksService.processStripeWebhook(payload);
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Failed to process Stripe webhook:', error);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  private verifyHeliusSignature(authHeader: string, payload: any): boolean {
    // In production, implement proper webhook signature verification
    // using Helius's webhook secret
    if (!authHeader) {
      return false;
    }

    return authHeader.startsWith('Bearer ');
  }

  private verifyKycSignature(authHeader: string, payload: any): boolean {
    // In production, implement proper webhook signature verification
    // using KYC provider's webhook secret
    if (!authHeader) {
      return false;
    }

    return authHeader.startsWith('Bearer ');
  }

  private verifyStripeSignature(signature: string, payload: any): boolean {
    // In production, implement proper Stripe webhook signature verification
    // using Stripe's webhook secret
    if (!signature) {
      return false;
    }

    return signature.startsWith('t=');
  }
}