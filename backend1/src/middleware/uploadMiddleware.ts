import multer from 'multer';
import { Request } from 'express';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {

    callback(new Error('Błąd bezpieczeństwa: niedozwolony format pliku.'));
  }
};

export const upload = multer({
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});
