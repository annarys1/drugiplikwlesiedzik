import { Router } from 'express';
import { getHeadmasterDashboard } from '../controllers/headmasterController';
import { authenticateToken } from '../middleware/authMiddleware';


const router = Router();


router.get(
 '/dashboard',
 authenticateToken as any,
 getHeadmasterDashboard
);


export default router;