import { Module } from '@nestjs/common';
import { PrismaModule } from '#src/lib/prisma/prisma.module.js';
import { HealthModule } from '#src/modules/health/health.module.js';
import { UserModule } from '#src/modules/user/user.module.js';

@Module({
  imports: [PrismaModule, HealthModule, UserModule],
})
export class AppModule {}
