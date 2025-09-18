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

import { UsersService } from './users.service';
import { JwtAuthGuard, AdminGuard } from '../common/guards/jwt.guard';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

const UpdateUserDto = z.object({
  role: z.enum(['INVESTOR', 'LISTER', 'ADMIN']).optional(),
  kycStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']).optional(),
  walletAddress: z.string().optional(),
});

const UpdateKycStatusDto = z.object({
  kycStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']),
  reason: z.string().optional(),
});

type UpdateUserDto = z.infer<typeof UpdateUserDto>;
type UpdateKycStatusDto = z.infer<typeof UpdateKycStatusDto>;

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(@Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getCurrentUser(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserDto)) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':id/kyc')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user KYC status (Admin only)' })
  @ApiResponse({ status: 200, description: 'KYC status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateKycStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateKycStatusDto)) updateKycDto: UpdateKycStatusDto,
  ) {
    return this.usersService.updateKycStatus(id, updateKycDto);
  }

  @Get(':id/listings')
  @ApiOperation({ summary: 'Get user listings' })
  @ApiResponse({ status: 200, description: 'User listings retrieved successfully' })
  async getUserListings(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.usersService.getUserListings(id, query);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'User orders retrieved successfully' })
  async getUserOrders(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.usersService.getUserOrders(id, query);
  }

  @Get(':id/votes')
  @ApiOperation({ summary: 'Get user votes' })
  @ApiResponse({ status: 200, description: 'User votes retrieved successfully' })
  async getUserVotes(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(PaginationDto)) query: PaginationDto,
  ) {
    return this.usersService.getUserVotes(id, query);
  }
}