import { AuthService } from './auth.service';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    role: 'INVESTOR' | 'LISTER';
    walletAddress?: string;
}
export declare class UpdateProfileDto {
    walletAddress?: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
    login(loginDto: LoginDto): Promise<{
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
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        updatedAt: Date;
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
