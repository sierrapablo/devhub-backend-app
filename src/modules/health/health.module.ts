import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from '#src/lib/database/entities/status.entity.js';
import { HealthController } from '#src/modules/health/health.controller.js';
import { HealthService } from '#src/modules/health/health.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([StatusEntity])],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
