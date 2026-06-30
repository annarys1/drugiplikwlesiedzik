import { Router } from 'express';
import multer from 'multer'; 
import { authenticateToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
import { runRecruitmentAlgorithm } from '../controllers/recruitmentController';


import { saveDraft, getDraft, submitApplication } from '../controllers/applicationDraftController';
import { savePreferences } from '../controllers/applicationPreferencesController';
import { uploadDocument } from '../controllers/documentController'; 
import { createApplication, updateApplicationStatus, getDirectorApplications, getParentApplications } from '../controllers/applicationController';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); 
  }
});

const upload = multer({ storage: storage });

const router = Router();




// 1. Automatyczne obliczanie punktów i składanie wniosku
router.post('/apply', authenticateToken as any, createApplication);

// 2. Zapis wersji roboczej / przechodzenie między krokami 
router.post('/draft', authenticateToken as any, saveDraft);

// 3. Pobieranie zapisanego szkicu formularza 
router.get('/draft', authenticateToken as any, getDraft);

// 4. Ostateczne zatwierdzenie konkretnego szkicu 
router.post('/submit/:id', authenticateToken as any, submitApplication);

// 5. Zapis preferencji wyboru placówek - MAX 3
router.post('/preferences', authenticateToken as any, savePreferences);

// 6. UPLOAD DOKUMENTU I POWIĄZANIE Z KRYTERIUM 
router.post('/upload', authenticateToken as any, upload.single('document'), uploadDocument);

router.get('/director/applications', authenticateToken as any, checkRole(['headmaster']), getDirectorApplications);

router.get('/my-applications', authenticateToken as any, getParentApplications);

// 7. Zmiana statusu wniosku przez Dyrektora 
router.patch('/status/:id_application', authenticateToken as any, checkRole(['headmaster']), updateApplicationStatus);

router.post('/run-recruitment', authenticateToken as any, checkRole(['admin']), runRecruitmentAlgorithm);
export default router;