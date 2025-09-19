import { PrismaService } from '../common/prisma/prisma.service';
export interface KycProvider {
    initiateVerification(data: any): Promise<{
        verificationUrl: string;
        verificationId: string;
    }>;
    getVerificationStatus(verificationId: string): Promise<{
        status: string;
        data: any;
    }>;
    handleCallback(payload: any): Promise<{
        userId: string;
        status: string;
    }>;
}
export declare class KycService {
    private readonly prisma;
    private readonly kycProvider;
    private readonly logger;
    constructor(prisma: PrismaService, kycProvider: KycProvider);
    initiateVerification(userId: string, data: {
        email: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        country: string;
    }): Promise<{
        verificationUrl: string;
        verificationId: string;
        status: string;
    }>;
    getVerificationStatus(userId: string): Promise<{
        userId: string;
        email: string;
        status: import("@prisma/client").$Enums.KycStatus;
        lastUpdated: Date;
    }>;
    handleCallback(payload: any): Promise<{
        success: boolean;
        userId: string;
        status: string;
    }>;
}
