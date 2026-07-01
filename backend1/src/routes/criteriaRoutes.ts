import { Router } from 'express';

import {
  getHeadmasterCriteria,
  addCriterionByHeadmaster,
  getCriteriaForInstitutions,
  deleteCriterionByHeadmaster,
  updateCriterionByHeadmaster
} from '../controllers/criteriaController';

import { getAllCriteriaPublic } from '../controllers/publicCriteriaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';


const router = Router();


// Publiczne kryteria
router.get(
  '/public/criteria',
  getAllCriteriaPublic
);


// Kryteria dyrektora
router.get(
  '/headmaster',
  authenticateToken,
  getHeadmasterCriteria
);


router.post(
  '/headmaster',
  authenticateToken,
  addCriterionByHeadmaster
);


router.put(
  '/headmaster/:id',
  authenticateToken,
  updateCriterionByHeadmaster
);


router.delete(
  '/headmaster/:id',
  authenticateToken,
  deleteCriterionByHeadmaster
);


// Kryteria dla wybranych placówek (rodzic)
router.get(
  '/list',
  getCriteriaForInstitutions
);


// Upload dokumentów
router.post(
  '/upload-doc',
  authenticateToken,
  upload.single('document'),
  (req, res) => {

    if (!req.file) {
      return res.status(400).json({
        message: 'Nie przesłano pliku lub plik jest nieprawidłowy.'
      });
    }

    res.json({
      message: 'Plik wgrany pomyślnie!',
      fileName: req.file.filename
    });

  }
);


export default router;