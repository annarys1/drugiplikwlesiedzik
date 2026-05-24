import { Router } from 'express';
import { addInstitution } from '../controllers/institutionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();


router.post('/add', authenticateToken as any, addInstitution);

export default router;