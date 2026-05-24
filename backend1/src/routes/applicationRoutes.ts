import { Router } from 'express';
import { createApplication,updateApplicationStatus } from '../controllers/applicationController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
const router = Router();

// Tylko zalogowany użytkownik (rodzic) może złożyć wniosek
router.post('/apply', authenticateToken as any, createApplication);
router.patch('/status/:id_application', authenticateToken as any, checkRole(['headmaster']), updateApplicationStatus);

export default router;