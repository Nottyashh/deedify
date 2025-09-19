import { PrismaService } from '../common/prisma/prisma.service';
export declare class WebhooksService {
    private readonly prisma;
    private readonly solanaService;
    private readonly logger;
    constructor(prisma: PrismaService, solanaService: any);
    processHeliusWebhook(payload: {
        type: 'TRANSFER' | 'NFT_SALE' | 'NFT_MINT' | 'NFT_BURN';
        signature: string;
        slot: number;
        timestamp: number;
        data: any;
    }): Promise<void>;
    processKycWebhook(payload: {
        event: 'verification_completed' | 'verification_failed';
        verification_id: string;
        status: 'approved' | 'declined';
        user_id: string;
        data: any;
    }): Promise<void>;
    processStripeWebhook(payload: {
        type: string;
        data: {
            object: any;
        };
    }): Promise<void>;
    private handleNftTransfer;
    private handleNftSale;
    private handleNftMint;
    private handleNftBurn;
    private handlePaymentSuccess;
    private handlePaymentFailure;
    private handleCustomerCreated;
}
