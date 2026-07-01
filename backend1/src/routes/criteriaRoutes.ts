import { Router } from 'express';

import {
  getHeadmasterCriteria,
  getCriteriaForInstitutions,
  deleteCriterionByHeadmaster,
  updateCriterionByHeadmaster,
  createHeadmasterCriterion,
  getAdminCriteria
} from '../controllers/criteriaController';

import { getAllCriteriaPublic } from '../controllers/publicCriteriaController';
import { authenticateToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

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

router.get(
  "/admin",
  getAdminCriteria
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

router.post(
  '/headmaster',
  authenticateToken,
  (
  req: AuthenticatedRequest,
  res,
  next
) => {

    console.log("JESTEM W ROUTE POST CRITERIA");
    
    console.log("BODY:", req.body);

    next();

  },
  createHeadmasterCriterion
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