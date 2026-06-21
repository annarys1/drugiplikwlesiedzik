import { Router } from 'express';
import { addChild } from '../controllers/childrenController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Trasa POST /api/children/add -> najpierw sprawdza token, potem wywołuje addChild
router.post('/add', authenticateToken as any, addChild);

export default router;