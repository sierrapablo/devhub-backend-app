import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '#src/lib/prisma/prisma.service.js';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserAuth, UserPublic } from '#src/modules/user/user.types.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(username: string, email: string, password: string): Promise<UserPublic> {
    const existingUser = await this.prisma.user.findFirst({
      select: {
        id: true,
      },
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        active: true,
        verified: true,
      },
    });

    return user;
  }

  async verifyUser(token: string): Promise<UserPublic> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not defined in .env');
    }

    let payload: jwt.JwtPayload;

    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (typeof decoded === 'string') {
        throw new Error('Invalid token payload.');
      }
      payload = decoded;
    } catch {
      throw new UnauthorizedException('Invalid verification token.');
    }

    const userId = payload.id;
    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('Invalid verification token.');
    }

    const existingUser = await this.prisma.user.findUnique({
      select: {
        id: true,
      },
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }

    const user = await this.prisma.user.update({
      data: { verified: true },
      select: {
        id: true,
        username: true,
        email: true,
        active: true,
        verified: true,
      },
      where: { id: userId },
    });

    const webhookUrl = process.env.N8N_WEBHOOK_EMAIL_URL;
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_EMAIL_URL not defined in .env');
    }

    await axios.post(webhookUrl, {
      id: user.id,
      email: user.email,
      username: user.username,
      token,
      verified: true,
    });

    return user;
  }

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
      // Esto es "config bug" del server, no del usuario
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
