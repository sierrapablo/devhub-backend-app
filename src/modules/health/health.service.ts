import { Injectable } from '@nestjs/common';
import { PrismaService } from '#src/lib/prisma/prisma.service.js';
import config from '#root/package.json' with { type: 'json' };
import type { Health } from '#src/modules/health/health.types.js';

const version: string = config.version;
@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async pingDB(): Promise<Health> {
    try {
      const check = await this.prisma.status.findFirst({
        orderBy: { date: 'desc' },
      });

      if (!check) throw new Error('No health record found');

      return {
        queryDate: new Date(),
        status: check.status ? 'OK' : 'KO',
        checkDate: check.date,
        appVersion: version,
        databaseVersion: check.id,
      };
    } catch (error) {
      console.error('DB error:', error);
      throw new Error('Failed to retrieve health status');
    }
  }
}
