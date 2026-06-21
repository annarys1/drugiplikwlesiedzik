import { Router } from 'express';
import {
  getHeadmasterCriteria,
  addCriterionByHeadmaster
} from '../controllers/criteriaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Endpointy dla dyrektora
// 1. Pobierz kryteria swojej placówki
router.get('/my-criteria', authenticateToken, getHeadmasterCriteria);

// 2. Dodaj nowe kryterium do swojej placówki
router.post('/add', authenticateToken, addCriterionByHeadmaster);

//bezpieczenstwo 
router.post('/upload-doc', authenticateToken, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nie przesłano pliku lub plik jest nieprawidłowy.' });
  }
  res.json({
    message: 'Plik wgrany pomyślnie!',
    fileName: req.file.filename
  });
});

export default router;
