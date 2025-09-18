import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AppConfigService } from '../common/config/config.service';

@Module({
  providers: [
    StorageService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: AppConfigService) => {
        const { createClient } = require('@supabase/supabase-js');
        return createClient(
          configService.get('SUPABASE_URL'),
          configService.get('SUPABASE_SERVICE_ROLE_KEY')
        );
      },
      inject: [AppConfigService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}