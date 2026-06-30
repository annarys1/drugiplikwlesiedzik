import { Router } from 'express';
import {
  getHeadmasterCriteria,
  addCriterionByHeadmaster,
  getCriteriaForInstitutions
} from '../controllers/criteriaController';
import { getAllCriteriaPublic } from '../controllers/publicCriteriaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Ścieżka publiczna (brak autoryzacji)
router.get('/public/criteria', getAllCriteriaPublic);

router.get('/my-criteria', authenticateToken, getHeadmasterCriteria);

router.post('/add', authenticateToken, addCriterionByHeadmaster);

router.post('/upload-doc', authenticateToken, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nie przesłano pliku lub plik jest nieprawidłowy.' });
  }
  res.json({
    message: 'Plik wgrany pomyślnie!',
    fileName: req.file.filename
  });
});
router.get('/list', getCriteriaForInstitutions);

export default router;
