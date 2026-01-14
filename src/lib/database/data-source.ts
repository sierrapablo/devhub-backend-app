import 'dotenv/config';
import { DataSource } from 'typeorm';
import { UserEntity } from '#src/lib/database/entities/user.entity.js';

export default new DataSource({
  type: 'postgres',
  url: String(process.env.DATABASE_URL ?? ''),
  entities: [UserEntity],
  migrations: ['dist/lib/database/migrations/*.js'],
  synchronize: false,
});
