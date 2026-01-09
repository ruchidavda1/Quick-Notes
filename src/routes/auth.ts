import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';

const router = Router();

// POST /auth/mock-login
router.post('/mock-login', (req: Request, res: Response): void => {
  const { userId } = req.body;

  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    res.status(400).json({ error: 'userId is required and must be a non-empty string' });
    return;
  }

  const token = authService.generateToken(userId.trim());
  res.status(200).json({ token });
});

export default router;

