import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const addChild = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
   
    const { name, firstName, lastName, pesel, date_birth, domicile } = req.body;
    

    const childName = name || firstName;
    const childSurname = lastName; 




    if (!childName || !childSurname || !pesel || !date_birth || !domicile) {
      res.status(400).json({ message: 'Wszystkie pola dziecka są wymagane!' });
      return;
    }

    
    const parentId = req.user?.id;

    if (!parentId) {
      res.status(401).json({ message: 'Nie udało się zidentyfikować rodzica!' });
      return;
    }


    // DODALAM
    if (!/^\d{11}$/.test(pesel)) {
    res.status(400).json({ message: 'PESEL musi mieć 11 cyfr!' });
    return;
    }

    const birthDate = new Date(date_birth);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
    age--;
    }

    if (age >= 7) {
    res.status(400).json({ message: 'Dziecko nie może być starsze niż 7 lat!' });
    return;
    }
    if (age < 0) {
    res.status(400).json({ message: 'Nieprawidłowa data urodzenia!' });
    return;
    }








    // Wstawiamy dane do bazy zachowując nazwy z Twojego screena (id_rodzica, surename)
    await db.query(
      'INSERT INTO children (id_rodzica, name, surname, pesel, date_birth, domicile) VALUES (?, ?, ?, ?, ?, ?)',
      [parentId, childName, childSurname, pesel, date_birth, domicile]
    );

    res.status(201).json({ message: 'Dziecko zostało pomyślnie dodane do systemu!' });
  } catch (error: any) {
    console.error('Błąd podczas dodawania dziecka:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas dodawania dziecka.' });
  }
};