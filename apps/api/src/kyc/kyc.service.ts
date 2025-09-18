import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

export interface KycProvider {
  initiateVerification(data: any): Promise<{ verificationUrl: string; verificationId: string }>;
  getVerificationStatus(verificationId: string): Promise<{ status: string; data: any }>;
  handleCallback(payload: any): Promise<{ userId: string; status: string }>;
}

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly kycProvider: KycProvider,
  ) {}

  async initiateVerification(userId: string, data: {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    country: string;
  }) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, kycStatus: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.kycStatus === 'VERIFIED') {
      throw new BadRequestException('User is already verified');
    }

    try {
      // Initiate verification with KYC provider
      const result = await this.kycProvider.initiateVerification({
        userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        country: data.country,
      });

      // Update user KYC status to pending
      await this.prisma.user.update({
        where: { id: userId },
        data: { kycStatus: 'PENDING' },
      });

      this.logger.log(`KYC verification initiated for user ${userId}`);

      return {
        verificationUrl: result.verificationUrl,
        verificationId: result.verificationId,
        status: 'PENDING',
      };
    } catch (error) {
      this.logger.error(`Failed to initiate KYC verification for user ${userId}:`, error);
      throw new BadRequestException('Failed to initiate KYC verification');
    }
  }

  async getVerificationStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      status: user.kycStatus,
      lastUpdated: user.updatedAt,
    };
  }

  async handleCallback(payload: any) {
    try {
      // Process callback from KYC provider
      const result = await this.kycProvider.handleCallback(payload);

      // Update user KYC status
      const kycStatus = result.status === 'approved' ? 'VERIFIED' : 'REJECTED';
      
      await this.prisma.user.update({
        where: { id: result.userId },
        data: { kycStatus },
      });

      this.logger.log(`KYC callback processed for user ${result.userId}: ${kycStatus}`);

      return {
        success: true,
        userId: result.userId,
        status: kycStatus,
      };
    } catch (error) {
      this.logger.error('Failed to process KYC callback:', error);
      throw new BadRequestException('Failed to process KYC callback');
    }
  }
}