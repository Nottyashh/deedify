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
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma/prisma.service';

interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record?: any;
  schema: string;
}

@ApiTags('auth')
@Controller('auth/webhooks')
export class AuthWebhooksController {
  private readonly logger = new Logger(AuthWebhooksController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('supabase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Supabase auth webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
  async handleSupabaseWebhook(
    @Body() payload: SupabaseWebhookPayload,
    @Headers('authorization') authHeader: string,
  ) {
    // Verify webhook signature (implement proper verification in production)
    if (!this.verifyWebhookSignature(authHeader, payload)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Received Supabase webhook: ${payload.type} on ${payload.table}`);

    try {
      switch (payload.type) {
        case 'INSERT':
          await this.handleUserCreated(payload.record);
          break;
        case 'UPDATE':
          await this.handleUserUpdated(payload.record, payload.old_record);
          break;
        case 'DELETE':
          await this.handleUserDeleted(payload.record);
          break;
        default:
          this.logger.warn(`Unknown webhook type: ${payload.type}`);
      }

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Failed to process webhook:', error);
      throw new BadRequestException('Failed to process webhook');
    }
  }

  private async handleUserCreated(record: any) {
    if (record.email) {
      await this.authService.verifySupabaseUser(record);
      this.logger.log(`User created from Supabase: ${record.email}`);
    }
  }

  private async handleUserUpdated(record: any, oldRecord: any) {
    // Handle user updates if needed
    this.logger.log(`User updated in Supabase: ${record.email}`);
  }

  private async handleUserDeleted(record: any) {
    // Handle user deletion if needed
    this.logger.log(`User deleted in Supabase: ${record.email}`);
  }

  private verifyWebhookSignature(authHeader: string, payload: any): boolean {
    // In production, implement proper webhook signature verification
    // using Supabase's webhook secret
    if (!authHeader) {
      return false;
    }

    // Basic check - replace with proper HMAC verification
    return authHeader.startsWith('Bearer ');
  }
}