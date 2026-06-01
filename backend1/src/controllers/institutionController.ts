
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';


export const getInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
   
    const [rows] = await db.query('SELECT id_institution, name, city, max_capacity FROM institution');
    
    res.status(200).json(rows);
  } catch (error: any) {
    console.error('Błąd podczas pobierania placówek:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania listy placówek.' });
  }
};
export const addInstitution = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, city, max_capacity } = req.body;

    if (!name || !city || !max_capacity) {
      res.status(400).json({ message: 'Wszystkie pola są wymagane!' });
      return;
    }


    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      res.status(403).json({ message: 'Brak uprawnień. Tylko administrator może dodawać placówki!' });
      return;
    }

    // Tutaj możesz przypisać id_headmaster jako null, skoro placówka jest tworzona przez admina
    await db.query(
      'INSERT INTO institution (name, city, max_capacity, id_headmaster) VALUES (?, ?, ?, ?)',
      [name, city, max_capacity, null] 
    );

    res.status(201).json({ message: 'Placówka została pomyślnie utworzona przez administratora!' });
  } catch (error: any) {
    console.error('Błąd:', error.message);
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};