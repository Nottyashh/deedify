import { z } from 'zod';
import { UsersService } from './users.service';
import { PaginationDto } from '../common/dto/pagination.dto';
declare const UpdateUserDto: z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<["INVESTOR", "LISTER", "ADMIN"]>>;
    kycStatus: z.ZodOptional<z.ZodEnum<["PENDING", "VERIFIED", "REJECTED", "EXPIRED"]>>;
    walletAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    role?: "INVESTOR" | "LISTER" | "ADMIN";
    walletAddress?: string;
    kycStatus?: "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED";
}, {
    role?: "INVESTOR" | "LISTER" | "ADMIN";
    walletAddress?: string;
    kycStatus?: "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED";
}>;
declare const UpdateKycStatusDto: z.ZodObject<{
    kycStatus: z.ZodEnum<["PENDING", "VERIFIED", "REJECTED", "EXPIRED"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kycStatus?: "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED";
    reason?: string;
}, {
    kycStatus?: "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED";
    reason?: string;
}>;
type UpdateUserDto = z.infer<typeof UpdateUserDto>;
type UpdateKycStatusDto = z.infer<typeof UpdateKycStatusDto>;
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getCurrentUser(req: any): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateKycStatus(id: string, updateKycDto: UpdateKycStatusDto): Promise<{
        reason: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserListings(id: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getUserOrders(id: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
    getUserVotes(id: string, query: PaginationDto): Promise<import("../common/dto/pagination.dto").PaginatedResponse<any>>;
}
export {};
