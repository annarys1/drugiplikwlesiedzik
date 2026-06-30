import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';
import crypto from 'crypto';

const PESEL_SALT = process.env.PESEL_SALT || 'domyslna-bardzo-tajna-sol';

const hashPesel = (pesel: string): string => {
  return crypto.createHash('sha256').update(pesel + PESEL_SALT).digest('hex');
};

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

    if (!/^\d{11}$/.test(pesel)) {
    res.status(400).json({ message: 'PESEL musi mieć 11 cyfr!' });
    return;
    }
	const peselHash = hashPesel(pesel);
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

    const [existingChildren]: any = await db.query(
      'SELECT id_children FROM children WHERE pesel = ?',
      [peselHash]
    );

    if (existingChildren.length > 0) {
      res.status(409).json({ message: 'Dziecko o podanym numerze PESEL jest już zarejestrowane w systemie.' });
      return;
    }

   const [result]: any = await db.query(
      'INSERT INTO children (id_rodzica, name, surname, pesel, date_birth, domicile) VALUES (?, ?, ?, ?, ?, ?)',
      [parentId, childName, childSurname, peselHash, date_birth, domicile]
    );

  
    const newChildId = result.insertId;

   
    res.status(201).json({ 
      message: 'Dziecko zostało pomyślnie dodane do systemu!',
      childId: newChildId 
    });
    
 } catch (error: any) {
  console.log("--- BŁĄD SERWERA ---");
  console.log(error); 
  res.status(500).json({ message: 'Błąd serwera', details: error.message });
}};
