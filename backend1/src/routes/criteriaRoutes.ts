import { Router } from 'express';
import {
  getHeadmasterCriteria,
  addCriterionByHeadmaster
} from '../controllers/criteriaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

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

export default router;
