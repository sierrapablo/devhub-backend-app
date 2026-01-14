import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEntity } from '#src/lib/database/entities/status.entity.js';
import config from '#root/package.json' with { type: 'json' };
import type { Health } from '#src/modules/health/health.types.js';
import type { Repository } from 'typeorm';

const version: string = config.version;
@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
  ) {}

  async pingDB(): Promise<Health> {
    try {
      const check = await this.statusRepository.findOne({
        order: { date: 'DESC' },
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
