import { Router } from 'express';
import { registerUser, registerHeadmaster, loginUser, getMe } from '../controllers/authController'; // Dodajemy getMe
import { authenticateToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
import { getAllUsers, updateUserRole } from '../controllers/adminController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', authenticateToken as any, getMe);

// Administracja
router.post('/register-headmaster', authenticateToken as any, checkRole(['admin']), registerHeadmaster);
router.get('/users', authenticateToken as any, checkRole(['admin']) as any, getAllUsers as any);
router.put('/user-role', authenticateToken as any, checkRole(['admin']) as any, updateUserRole as any);

export default router;