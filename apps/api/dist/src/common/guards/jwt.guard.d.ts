import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export interface AuthenticatedUser {
    sub: string;
    email: string;
    role: string;
    walletAddress?: string;
    iat: number;
    exp: number;
}
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    private readonly logger;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
export declare class AdminGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): boolean;
}
export declare class ListerGuard implements CanActivate {
    private readonly logger;
    canActivate(context: ExecutionContext): boolean;
}
