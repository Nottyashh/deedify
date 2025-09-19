import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma/prisma.service';
interface SupabaseWebhookPayload {
    type: 'INSERT' | 'UPDATE' | 'DELETE';
    table: string;
    record: any;
    old_record?: any;
    schema: string;
}
export declare class AuthWebhooksController {
    private readonly authService;
    private readonly prisma;
    private readonly logger;
    constructor(authService: AuthService, prisma: PrismaService);
    handleSupabaseWebhook(payload: SupabaseWebhookPayload, authHeader: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private handleUserCreated;
    private handleUserUpdated;
    private handleUserDeleted;
    private verifyWebhookSignature;
}
export {};
