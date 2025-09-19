import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

@Module({
  providers: [
    StorageService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const { createClient } = require('@supabase/supabase-js');
        return createClient(
          configService.get('SUPABASE_URL'),
          configService.get('SUPABASE_SERVICE_ROLE_KEY')
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}