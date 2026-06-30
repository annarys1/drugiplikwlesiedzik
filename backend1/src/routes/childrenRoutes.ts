import { Router } from 'express';
import { addChild } from '../controllers/childrenController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/add', authenticateToken as any, addChild);

export default router;