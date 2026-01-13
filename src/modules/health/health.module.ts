import { Module } from '@nestjs/common';
import { HealthController } from '#src/modules/health/health.controller.js';
import { HealthService } from '#src/modules/health/health.service.js';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
