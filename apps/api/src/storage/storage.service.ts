import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AppConfigService } from '../common/config/config.service';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(
    private configService: AppConfigService,
    private supabaseClient: any,
  ) {}

  async uploadFile(
    file: Buffer,
    fileName: string,
    bucket: string = 'deedify-documents',
    contentType?: string
  ): Promise<{ path: string; url: string }> {
    try {
      // Generate unique file path
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const filePath = `${timestamp}_${randomId}_${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await this.supabaseClient.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: contentType || 'application/octet-stream',
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);

      this.logger.log(`File uploaded successfully: ${filePath}`);

      return {
        path: filePath,
        url: urlData.publicUrl,
      };
    } catch (error) {
      this.logger.error('Failed to upload file:', error);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async uploadDocument(
    file: Buffer,
    fileName: string,
    listingId: string,
    documentKind: 'DEED' | 'SURVEY' | 'IMAGE' | 'OTHER',
    uploadedBy: string
  ): Promise<{ path: string; url: string }> {
    try {
      // Determine bucket based on document kind
      const bucket = this.getBucketForDocumentKind(documentKind);
      
      // Generate file path with listing context
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const filePath = `listings/${listingId}/${documentKind.toLowerCase()}/${timestamp}_${randomId}_${fileName}`;

      // Upload file
      const result = await this.uploadFile(file, fileName, bucket);

      this.logger.log(`Document uploaded: ${filePath} for listing ${listingId}`);

      return result;
    } catch (error) {
      this.logger.error('Failed to upload document:', error);
      throw new BadRequestException('Failed to upload document');
    }
  }

  async getSignedUrl(
    path: string,
    bucket: string = 'deedify-documents',
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const { data, error } = await this.supabaseClient.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        throw new Error(`Failed to create signed URL: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      this.logger.error('Failed to create signed URL:', error);
      throw new BadRequestException('Failed to create signed URL');
    }
  }

  async deleteFile(
    path: string,
    bucket: string = 'deedify-documents'
  ): Promise<void> {
    try {
      const { error } = await this.supabaseClient.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }

      this.logger.log(`File deleted successfully: ${path}`);
    } catch (error) {
      this.logger.error('Failed to delete file:', error);
      throw new BadRequestException('Failed to delete file');
    }
  }

  async listFiles(
    bucket: string = 'deedify-documents',
    path?: string
  ): Promise<any[]> {
    try {
      const { data, error } = await this.supabaseClient.storage
        .from(bucket)
        .list(path);

      if (error) {
        throw new Error(`Failed to list files: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      this.logger.error('Failed to list files:', error);
      throw new BadRequestException('Failed to list files');
    }
  }

  async getFileInfo(
    path: string,
    bucket: string = 'deedify-documents'
  ): Promise<any> {
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
    } catch (error) {
      this.logger.error('Failed to get file info:', error);
      throw new BadRequestException('Failed to get file info');
    }
  }

  private getBucketForDocumentKind(kind: 'DEED' | 'SURVEY' | 'IMAGE' | 'OTHER'): string {
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
}