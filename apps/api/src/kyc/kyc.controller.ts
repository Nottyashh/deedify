import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { z } from 'zod';

import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';

const InitiateKycDto = z.object({
  userId: z.string().cuid('Invalid user ID'),
  email: z.string().email('Invalid email'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().datetime('Invalid date of birth'),
  country: z.string().min(2, 'Country code is required'),
});

type InitiateKycDto = z.infer<typeof InitiateKycDto>;

@ApiTags('kyc')
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate KYC verification' })
  @ApiResponse({ status: 200, description: 'KYC verification initiated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async initiateKyc(
    @Request() req,
    @Body(new ZodValidationPipe(InitiateKycDto)) initiateKycDto: InitiateKycDto,
  ) {
    return this.kycService.initiateVerification(req.user.sub, initiateKycDto);
  }

  @Get('status/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get KYC verification status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getKycStatus(@Param('userId') userId: string) {
    return this.kycService.getVerificationStatus(userId);
  }

  @Get('my-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  async getMyKycStatus(@Request() req) {
    return this.kycService.getVerificationStatus(req.user.sub);
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle KYC provider callback' })
  @ApiResponse({ status: 200, description: 'Callback processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid callback data' })
  async handleCallback(@Body() payload: any) {
    return this.kycService.handleCallback(payload);
  }
}