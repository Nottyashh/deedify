import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
export interface AuthenticatedUser {
    sub: string;
    email: string;
    role: string;
    walletAddress?: string;
    iat: number;
    exp: number;
}
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(data: {
        email: string;
        password: string;
        role: 'INVESTOR' | 'LISTER';
        walletAddress?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            walletAddress: string;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            createdAt: Date;
        };
        message: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            walletAddress: string;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
        };
        accessToken: string;
        tokenType: string;
        expiresIn: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, data: {
        walletAddress?: string;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        updatedAt: Date;
    }>;
    refreshToken(user: AuthenticatedUser): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    verifySupabaseUser(supabaseUser: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private isValidSolanaAddress;
}
