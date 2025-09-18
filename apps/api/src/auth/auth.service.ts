import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { AppConfigService } from '../common/config/config.service';
import * as bcrypt from 'bcrypt';

export interface AuthenticatedUser {
  sub: string;
  email: string;
  role: string;
  walletAddress?: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: AppConfigService,
  ) {}

  async register(data: {
    email: string;
    password: string;
    role: 'INVESTOR' | 'LISTER';
    walletAddress?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate wallet address if provided
    if (data.walletAddress) {
      const isValidWallet = this.isValidSolanaAddress(data.walletAddress);
      if (!isValidWallet) {
        throw new BadRequestException('Invalid Solana wallet address');
      }

      // Check if wallet is already in use
      const existingWallet = await this.prisma.user.findUnique({
        where: { walletAddress: data.walletAddress },
      });

      if (existingWallet) {
        throw new ConflictException('Wallet address is already in use');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        role: data.role,
        walletAddress: data.walletAddress,
        // Note: In a real app, you'd store the hashed password
        // For now, we'll use Supabase Auth for password management
      },
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    this.logger.log(`New user registered: ${user.email} (${user.role})`);

    return {
      user,
      message: 'User registered successfully. Please verify your email.',
    };
  }

  async login(data: { email: string; password: string }) {
    // In a real implementation, you'd verify the password
    // For now, we'll assume Supabase Auth handles this
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
        kycStatus: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: Omit<AuthenticatedUser, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    };

    const token = this.jwtService.sign(payload);

    this.logger.log(`User logged in: ${user.email}`);

    return {
      user,
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: '7d',
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
        kycStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: { walletAddress?: string }) {
    // Validate wallet address if provided
    if (data.walletAddress) {
      const isValidWallet = this.isValidSolanaAddress(data.walletAddress);
      if (!isValidWallet) {
        throw new BadRequestException('Invalid Solana wallet address');
      }

      // Check if wallet is already in use by another user
      const existingWallet = await this.prisma.user.findFirst({
        where: {
          walletAddress: data.walletAddress,
          id: { not: userId },
        },
      });

      if (existingWallet) {
        throw new ConflictException('Wallet address is already in use');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        walletAddress: true,
        kycStatus: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User profile updated: ${user.email}`);

    return user;
  }

  async refreshToken(user: AuthenticatedUser) {
    const payload: Omit<AuthenticatedUser, 'iat' | 'exp'> = {
      sub: user.sub,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: '7d',
    };
  }

  async logout(userId: string) {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just log the logout
    this.logger.log(`User logged out: ${userId}`);
    
    return {
      message: 'Logout successful',
    };
  }

  async verifySupabaseUser(supabaseUser: any) {
    // This method will be called by the webhook when a user signs up via Supabase
    const existingUser = await this.prisma.user.findUnique({
      where: { email: supabaseUser.email },
    });

    if (existingUser) {
      return existingUser;
    }

    // Create user from Supabase data
    const user = await this.prisma.user.create({
      data: {
        email: supabaseUser.email,
        role: 'INVESTOR', // Default role
        walletAddress: null,
        kycStatus: 'PENDING',
      },
    });

    this.logger.log(`User created from Supabase: ${user.email}`);

    return user;
  }

  private isValidSolanaAddress(address: string): boolean {
    try {
      // Basic validation - in production, use a proper Solana address validator
      return address.length >= 32 && address.length <= 44;
    } catch {
      return false;
    }
  }
}