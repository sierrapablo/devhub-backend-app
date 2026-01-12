import { healthRoutes } from '@/modules/health';
import { userRoutes } from '@/modules/user';

export const apiModules = [
  { path: 'health', routes: healthRoutes },
  { path: 'user', routes: userRoutes },
];
