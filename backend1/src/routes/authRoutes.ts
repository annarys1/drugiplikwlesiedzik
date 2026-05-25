import { Router } from 'express';
import { registerUser, loginUser,registerHeadmaster } from '../controllers/authController';

const router = Router();

// Rejestracja
router.post('/register', registerUser);
router.post('/register-headmaster', registerHeadmaster);

// Logowanie
router.post('/login', loginUser);

export default router;