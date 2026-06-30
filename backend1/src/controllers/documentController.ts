import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id_application, id_criterion } = req.body;
    const file = req.file; 

    if (!file) {
      res.status(400).json({ message: 'Nie przesłano żadnego pliku!' });
      return;
    }

    if (!id_application || !id_criterion) {
      res.status(400).json({ message: 'Brak id_application lub id_criterion!' });
      return;
    }

    await db.query(
      'INSERT INTO application_documents (id_application, id_criterion, file_path) VALUES (?, ?, ?)',
      [id_application, id_criterion, file.path]
    );

    res.status(201).json({ 
      message: 'Dokument przesłany pomyślnie!',
      filePath: file.path 
    });

  } catch (error: any) {
    console.error('Błąd uploadu:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas uploadu plików.' });
  }
};