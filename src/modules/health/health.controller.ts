import { Controller, Get } from '@nestjs/common';
import { HealthService } from '#src/modules/health/health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealthStatus() {
    return this.healthService.pingDB();
  }
}
