import { Router, Request, Response } from 'express';

const router = Router();

// GET /health - Health check endpoint
router.get('/', (req: Request, res: Response): void => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

export default router;

