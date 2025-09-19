"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../common/config/config.service");
let StorageService = StorageService_1 = class StorageService {
    constructor(configService, supabaseClient) {
        this.configService = configService;
        this.supabaseClient = supabaseClient;
        this.logger = new common_1.Logger(StorageService_1.name);
    }
    async uploadFile(file, fileName, bucket = 'deedify-documents', contentType) {
        try {
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 8);
            const filePath = `${timestamp}_${randomId}_${fileName}`;
            const { data, error } = await this.supabaseClient.storage
                .from(bucket)
                .upload(filePath, file, {
                contentType: contentType || 'application/octet-stream',
                upsert: false,
            });
            if (error) {
                throw new Error(`Upload failed: ${error.message}`);
            }
            const { data: urlData } = this.supabaseClient.storage
                .from(bucket)
                .getPublicUrl(filePath);
            this.logger.log(`File uploaded successfully: ${filePath}`);
            return {
                path: filePath,
                url: urlData.publicUrl,
            };
        }
        catch (error) {
            this.logger.error('Failed to upload file:', error);
            throw new common_1.BadRequestException('Failed to upload file');
        }
    }
    async uploadDocument(file, fileName, listingId, documentKind, uploadedBy) {
        try {
            const bucket = this.getBucketForDocumentKind(documentKind);
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 8);
            const filePath = `listings/${listingId}/${documentKind.toLowerCase()}/${timestamp}_${randomId}_${fileName}`;
            const result = await this.uploadFile(file, fileName, bucket);
            this.logger.log(`Document uploaded: ${filePath} for listing ${listingId}`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to upload document:', error);
            throw new common_1.BadRequestException('Failed to upload document');
        }
    }
    async getSignedUrl(path, bucket = 'deedify-documents', expiresIn = 3600) {
        try {
            const { data, error } = await this.supabaseClient.storage
                .from(bucket)
                .createSignedUrl(path, expiresIn);
            if (error) {
                throw new Error(`Failed to create signed URL: ${error.message}`);
            }
            return data.signedUrl;
        }
        catch (error) {
            this.logger.error('Failed to create signed URL:', error);
            throw new common_1.BadRequestException('Failed to create signed URL');
        }
    }
    async deleteFile(path, bucket = 'deedify-documents') {
        try {
            const { error } = await this.supabaseClient.storage
                .from(bucket)
                .remove([path]);
            if (error) {
                throw new Error(`Failed to delete file: ${error.message}`);
            }
            this.logger.log(`File deleted successfully: ${path}`);
        }
        catch (error) {
            this.logger.error('Failed to delete file:', error);
            throw new common_1.BadRequestException('Failed to delete file');
        }
    }
    async listFiles(bucket = 'deedify-documents', path) {
        try {
            const { data, error } = await this.supabaseClient.storage
                .from(bucket)
                .list(path);
            if (error) {
                throw new Error(`Failed to list files: ${error.message}`);
            }
            return data || [];
        }
        catch (error) {
            this.logger.error('Failed to list files:', error);
            throw new common_1.BadRequestException('Failed to list files');
        }
    }
    async getFileInfo(path, bucket = 'deedify-documents') {
        try {
            const { data, error } = await this.supabaseClient.storage
                .from(bucket)
                .getPublicUrl(path);
            if (error) {
                throw new Error(`Failed to get file info: ${error.message}`);
            }
            return {
                path,
                url: data.publicUrl,
                bucket,
            };
        }
        catch (error) {
            this.logger.error('Failed to get file info:', error);
            throw new common_1.BadRequestException('Failed to get file info');
        }
    }
    getBucketForDocumentKind(kind) {
        switch (kind) {
            case 'DEED':
                return 'deedify-deeds';
            case 'SURVEY':
                return 'deedify-surveys';
            case 'IMAGE':
                return 'deedify-images';
            default:
                return 'deedify-documents';
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.AppConfigService, Object])
], StorageService);
//# sourceMappingURL=storage.service.js.map