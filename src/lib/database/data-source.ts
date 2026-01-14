import 'dotenv/config';
import { DataSource } from 'typeorm';
import { RefreshTokenEntity } from '../../contexts/auth/infra/typeorm/refresh-token.entity.js';
import { UserEntity } from '../../contexts/user/infra/typeorm/user.entity.js';

export default new DataSource({
  type: 'postgres',
  url: String(process.env.DATABASE_URL ?? ''),
  entities: [UserEntity, RefreshTokenEntity],
  migrations: ['src/lib/database/migrations/*.ts'],
  synchronize: false,
});
