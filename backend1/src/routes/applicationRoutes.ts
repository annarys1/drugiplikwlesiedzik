import { Router } from 'express';
import { createApplication } from '../controllers/applicationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Tylko zalogowany użytkownik (rodzic) może złożyć wniosek
router.post('/apply', authenticateToken as any, createApplication);

export default router;