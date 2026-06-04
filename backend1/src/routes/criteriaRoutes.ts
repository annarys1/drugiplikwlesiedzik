import { Router } from 'express';
import { 
  getHeadmasterCriteria, 
  addCriterionByHeadmaster 
} from '../controllers/criteriaController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Endpointy dla dyrektora
// 1. Pobierz kryteria swojej placówki
router.get('/my-criteria', authenticateToken, getHeadmasterCriteria);

// 2. Dodaj nowe kryterium do swojej placówki
router.post('/add', authenticateToken, addCriterionByHeadmaster);

export default router;
