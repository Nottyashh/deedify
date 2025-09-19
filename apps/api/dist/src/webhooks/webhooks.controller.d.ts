import { WebhooksService } from './webhooks.service';
interface HeliusWebhookPayload {
    type: 'TRANSFER' | 'NFT_SALE' | 'NFT_MINT' | 'NFT_BURN';
    signature: string;
    slot: number;
    timestamp: number;
    data: any;
}
interface KycWebhookPayload {
    event: 'verification_completed' | 'verification_failed';
    verification_id: string;
    status: 'approved' | 'declined';
    user_id: string;
    data: any;
}
interface StripeWebhookPayload {
    type: string;
    data: {
        object: any;
    };
}
export declare class WebhooksController {
    private readonly webhooksService;
    private readonly logger;
    constructor(webhooksService: WebhooksService);
    handleHeliusWebhook(payload: HeliusWebhookPayload, authHeader: string): Promise<{
        success: boolean;
        message: string;
    }>;
    handleKycWebhook(payload: KycWebhookPayload, authHeader: string): Promise<{
        success: boolean;
        message: string;
    }>;
    handleStripeWebhook(payload: StripeWebhookPayload, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private verifyHeliusSignature;
    private verifyKycSignature;
    private verifyStripeSignature;
}
export {};
