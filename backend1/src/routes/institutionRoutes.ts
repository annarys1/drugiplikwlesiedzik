import { Router } from 'express';
import { addInstitution, getInstitutions } from '../controllers/institutionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';

const router = Router();


router.post('/add', authenticateToken as any, checkRole(['admin']), addInstitution);
router.get('/list', getInstitutions);
export default router;