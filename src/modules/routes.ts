import * as healthModule from './health';

export const apiModules = [{ path: 'health', routes: healthModule.healthRoutes }];
