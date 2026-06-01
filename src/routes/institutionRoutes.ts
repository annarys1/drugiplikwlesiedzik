import { Router } from 'express';
import { addInstitution, getInstitutions } from '../controllers/institutionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();


router.post('/add', authenticateToken as any, addInstitution);
router.get('/list', getInstitutions);
export default router;