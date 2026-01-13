import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '#src/lib/prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserAuth } from '#src/modules/user/user.types.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string): Promise<UserAuth> {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        password: true,
        active: true,
        verified: true,
      },
      where: { email },
    });

    const loginError = 'Error logging in.';

    if (!user) throw new UnauthorizedException(loginError);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid || !user.active || !user.verified) {
      throw new UnauthorizedException(loginError);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      // Esto es “config bug” del server, no del usuario
      throw new Error('JWT_SECRET not defined in .env');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });

    return {
      id: user.id,
      email: user.email,
      token,
    };
  }
}
