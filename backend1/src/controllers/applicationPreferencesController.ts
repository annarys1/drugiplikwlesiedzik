import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';
import { calculatePointsForInstitution } from '../utils/pointsCalculator';

export const savePreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
 const connection = await db.getConnection();
  try {
    const parentId = req.user?.id;
    const { id_application, institutions } = req.body;

    if (!parentId) {
      res.status(401).json({ message: 'Brak autoryzacji' });
      return;
    }

    if (!id_application || !institutions || !Array.isArray(institutions)) {
      res.status(400).json({ message: 'Niepoprawne dane żądania!' });
      return;
    }

    if (institutions.length > 3) {
      res.status(400).json({ 
        message: 'Błąd walidacji: Możesz wybrać maksymalnie 3 placówki preferowane!' 
      });
      return;
    }

    if (institutions.length === 0) {
      res.status(400).json({ message: 'Musisz wybrać co najmniej jedną placówkę!' });
      return;
    }

    const orders = institutions.map(inst => inst.order);
    const hasDuplicates = new Set(orders).size !== orders.length;
    if (hasDuplicates) {
      res.status(400).json({ message: 'Każda placówka musi mieć unikalny priorytet (1, 2 lub 3)!' });
      return;
    }
  
    await connection.beginTransaction();

    await connection.query('DELETE FROM application_institutions WHERE id_application = ?', [id_application]);

 for (const inst of institutions) {

      const pointsForThisInst = await calculatePointsForInstitution(
        connection, 
        id_application,
        inst.id_institution 
        
      );

      await connection.query(
        'INSERT INTO application_institutions (id_application, id_institution, preference_order, calculated_points) VALUES (?, ?, ?, ?)',
        [id_application, inst.id_institution, inst.order, pointsForThisInst]
      );
      
      console.log(`Dla placówki ${inst.id_institution} obliczono: ${pointsForThisInst} pkt.`);
    }

    await connection.commit();
    res.status(200).json({ message: 'Preferencje oraz punkty zostały pomyślnie zapisane!' });
  } catch (error: any) {
    await connection.rollback();
    console.error('Błąd podczas zapisu preferencji:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas zapisu preferencji.' });
  }
  finally {
    connection.release();
  }
};
