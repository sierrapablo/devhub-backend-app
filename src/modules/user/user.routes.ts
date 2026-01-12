import express from 'express';
import { login } from '@/modules/user/user.controllers';

const router = express.Router();

router.post('/auth/login', login);

export default router;
