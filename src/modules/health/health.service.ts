import { prisma } from '@/lib/prisma/client';
import type { Health } from '@/modules/health/health.types';
import { version } from '@root/package.json';

export const pingDB = async (): Promise<Health> => {
  try {
    const check = await prisma.status.findFirst({
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
    throw new Error('Failed to retrieve concerts');
  }
};
