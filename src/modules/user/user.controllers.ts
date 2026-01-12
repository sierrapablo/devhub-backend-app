import { NextFunction, Request, Response } from 'express';
import { loginService } from '@/modules/user/user.services';

/**
 * Login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }
    const userAuth = await loginService(email, password);
    res.status(200).json(userAuth);
  } catch (error: any) {
    next(error);
  }
};
