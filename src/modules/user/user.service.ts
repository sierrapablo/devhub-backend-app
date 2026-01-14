import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '#src/lib/database/entities/user.entity.js';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserAuth, UserPublic } from '#src/modules/user/user.types.js';
import type { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(username: string, email: string, password: string): Promise<UserPublic> {
    const existingUser = await this.userRepository.findOne({
      select: ['id'],
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('User already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({
        username,
        email,
        password: passwordHash,
      }),
    );

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      // Esto es "config bug" del server, no del usuario
      throw new Error('JWT_SECRET not defined in .env');
    }

    const webhookUrl = process.env.N8N_WEBHOOK_EMAIL_URL;
    if (!webhookUrl) {
      throw new Error('N8N_WEBHOOK_EMAIL_URL not defined in .env');
    }

    const verificationToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: '24h',
    });

    await axios.post(webhookUrl, {
      id: user.id,
      email: user.email,
      username: user.username,
      token: verificationToken,
      verified: false,
    });

    return this.toPublicUser(user);
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
        throw new TypeError('Invalid token payload.');
      }
      payload = decoded;
    } catch {
      throw new UnauthorizedException('Invalid verification token.');
    }

    const userId = payload.id;
    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('Invalid verification token.');
    }

    const existingUser = await this.userRepository.findOne({
      select: ['id'],
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }

    await this.userRepository.update({ id: userId }, { verified: true });
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

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

    return this.toPublicUser(user);
  }

  async login(email: string, password: string): Promise<UserAuth> {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'active', 'verified'],
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

  private toPublicUser(user: UserEntity): UserPublic {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      active: user.active,
      verified: user.verified,
    };
  }
}
