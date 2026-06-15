import { Router } from 'express';
import { registerUser,registerHeadmaster, loginUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
import { getAllUsers, updateUserRole } from '../controllers/adminController';
const router = Router();

// Trasa dla zwykłego rodzica (publiczna)
router.post('/register', registerUser);

// Trasa dla dyrektora (TYLKO DLA ADMINA)
router.post('/register-headmaster', authenticateToken as any, checkRole(['admin']), registerHeadmaster);

// Logowanie (publiczne)
router.post('/login', loginUser);

router.get(
  '/users',
  authenticateToken as any,
  checkRole(['admin']) as any,
  getAllUsers as any
);

router.put(
  '/user-role',
  authenticateToken as any,
  checkRole(['admin']) as any,
  updateUserRole as any
);


export default router;