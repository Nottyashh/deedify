import { UsersRepository } from './users.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly logger;
    constructor(usersRepository: UsersRepository);
    findAll(query: PaginationDto): Promise<PaginatedResponse<any>>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: {
        role?: 'INVESTOR' | 'LISTER' | 'ADMIN';
        kycStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
        walletAddress?: string;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateKycStatus(id: string, data: {
        kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
        reason?: string;
    }): Promise<{
        reason: string;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        walletAddress: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserListings(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getUserOrders(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    getUserVotes(userId: string, query: PaginationDto): Promise<PaginatedResponse<any>>;
    private isValidSolanaAddress;
}
