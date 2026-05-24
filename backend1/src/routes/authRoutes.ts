import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// Rejestracja
router.post('/register', registerUser);

// Logowanie
router.post('/login', loginUser);

export default router;