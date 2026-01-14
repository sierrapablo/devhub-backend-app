import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { RefreshTokenRepository } from '#src/contexts/auth/domain/refresh-token-repository.js';
import type { RefreshToken } from '#src/contexts/auth/domain/refresh-token.js';
import { RefreshTokenEntity } from '#src/contexts/auth/infra/typeorm/refresh-token.entity.js';

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {}

  async create(token: RefreshToken): Promise<RefreshToken> {
    const entity = this.repository.create(token);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<RefreshToken | null> {
    return this.repository.findOne({ where: { id } });
  }

  async revoke(id: string, replacedByTokenId?: string): Promise<void> {
    await this.repository.update(
      { id },
      {
        revokedAt: new Date(),
        replacedByTokenId: replacedByTokenId ?? null,
      },
    );
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId },
      {
        revokedAt: new Date(),
        replacedByTokenId: null,
      },
    );
  }
}
