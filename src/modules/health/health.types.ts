export interface Health {
  queryDate: Date;
  status: 'OK' | 'KO';
  checkDate: Date;
  appVersion: string;
  databaseVersion: number;
}
