import { AppConfigService } from '../common/config/config.service';
export declare class StorageService {
    private configService;
    private supabaseClient;
    private readonly logger;
    constructor(configService: AppConfigService, supabaseClient: any);
    uploadFile(file: Buffer, fileName: string, bucket?: string, contentType?: string): Promise<{
        path: string;
        url: string;
    }>;
    uploadDocument(file: Buffer, fileName: string, listingId: string, documentKind: 'DEED' | 'SURVEY' | 'IMAGE' | 'OTHER', uploadedBy: string): Promise<{
        path: string;
        url: string;
    }>;
    getSignedUrl(path: string, bucket?: string, expiresIn?: number): Promise<string>;
    deleteFile(path: string, bucket?: string): Promise<void>;
    listFiles(bucket?: string, path?: string): Promise<any[]>;
    getFileInfo(path: string, bucket?: string): Promise<any>;
    private getBucketForDocumentKind;
}
