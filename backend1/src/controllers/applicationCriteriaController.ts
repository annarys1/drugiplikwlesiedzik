import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const addCriteriaToApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id_application, criteria } = req.body;

    if (!id_application || !Array.isArray(criteria)) {
      res.status(400).json({ message: 'Niepoprawne dane żądania!' });
      return;
    }

    await db.query('DELETE FROM application_criteria WHERE id_application = ?', [id_application]);

    if (criteria.length > 0) {
      const values = criteria.map((c: any) => [
        id_application,
        c.id_criterion,
        c.value || c.declared_value || 0
      ]);
      await db.query(
        'INSERT INTO application_criteria (id_application, id_criterion, declared_value) VALUES ?',
        [values]
      );
    }

    res.status(200).json({ message: 'Kryteria zapisane.' });
  } catch (error: any) {
    console.error('Błąd zapisu kryteriów:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas zapisu kryteriów.' });
  }
};
