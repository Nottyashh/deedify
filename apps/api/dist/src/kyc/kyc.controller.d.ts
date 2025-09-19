import { z } from 'zod';
import { KycService } from './kyc.service';
declare const InitiateKycDto: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    dateOfBirth: z.ZodString;
    country: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    country?: string;
}, {
    email?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    country?: string;
}>;
type InitiateKycDto = z.infer<typeof InitiateKycDto>;
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    initiateKyc(req: any, initiateKycDto: InitiateKycDto): Promise<{
        verificationUrl: string;
        verificationId: string;
        status: string;
    }>;
    getKycStatus(userId: string): Promise<{
        userId: string;
        email: string;
        status: import("@prisma/client").$Enums.KycStatus;
        lastUpdated: Date;
    }>;
    getMyKycStatus(req: any): Promise<{
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
export {};
