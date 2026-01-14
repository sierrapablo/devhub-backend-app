import { Module } from '@nestjs/common';
import { DatabaseModule } from '#src/lib/database/database.module.js';
import { HealthModule } from '#src/modules/health/health.module.js';
import { UserModule } from '#src/modules/user/user.module.js';

@Module({
  imports: [DatabaseModule, HealthModule, UserModule],
})
export class AppModule {}
