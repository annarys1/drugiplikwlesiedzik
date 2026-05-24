
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const addInstitution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, city, max_capacity } = req.body;

    
    if (!name || !city || !max_capacity) {
      res.status(400).json({ message: 'Wszystkie pola (nazwa, miasto, maksymalna pojemność) są wymagane!' });
      return;
    }

    
    const headmasterId = req.user?.id;
    const userRole = req.user?.role;

   
    if (userRole !== 'headmaster') {
      res.status(403).json({ message: 'Brak uprawnień. Tylko dyrektor może dodać placówkę!' });
      return;
    }

    if (!headmasterId) {
      res.status(401).json({ message: 'Nie udało się zidentyfikować dyrektora.' });
      return;
    }

    
    await db.query(
      'INSERT INTO institution (id_headmaster, name, city, max_capacity) VALUES (?, ?, ?, ?)',
      [headmasterId, name, city, max_capacity]
    );

    res.status(201).json({ message: 'Placówka została pomyślnie utworzona w systemie!' });
  } catch (error: any) {
    console.error('Błąd podczas dodawania placówki:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas dodawania placówki.' });
  }
};