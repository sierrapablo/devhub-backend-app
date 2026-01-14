import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { UserRepository } from '#src/contexts/user/domain/user-repository.js';
import type { User } from '#src/contexts/user/domain/user.js';
import { UserEntity } from '#src/contexts/user/infra/typeorm/user.entity.js';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByEmailOrUsername(email: string, username: string): Promise<User | null> {
    return this.repository.findOne({
      where: [{ email }, { username }],
    });
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const entity = this.repository.create(user);
    return this.repository.save(entity);
  }

  async updateVerified(id: string, verified: boolean): Promise<User | null> {
    await this.repository.update({ id }, { verified });
    return this.repository.findOne({ where: { id } });
  }
}
