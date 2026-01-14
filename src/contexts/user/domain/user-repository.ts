import type { User } from '#src/contexts/user/domain/user.js';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailOrUsername(email: string, username: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  updateVerified(id: string, verified: boolean): Promise<User | null>;
}
