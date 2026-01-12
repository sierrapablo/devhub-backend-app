import { prisma } from '@/lib/prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserAuth } from '@/modules/user/user.types';

export const loginService = async (email: string, password: string): Promise<UserAuth> => {
  const user = await prisma.user.findUnique({
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

  if (!user) throw new Error(loginError);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid || !user.active || !user.verified) throw new Error(loginError);

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return {
    id: user.id,
    email: user.email,
    token,
  };
};
