import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { version } from '@root/package.json';

export type Health = {
  queryDate: Date;
  status: 'OK' | 'KO';
  checkDate: Date;
  appVersion: string;
  databaseVersion: number | string;
};

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
