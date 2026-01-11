export interface Health {
  status: 'OK' | 'KO';
  date: Date;
  appVersion: string;
  databaseVersion: number;
}
