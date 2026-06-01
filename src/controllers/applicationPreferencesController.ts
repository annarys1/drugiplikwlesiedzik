import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const savePreferences = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

    // Walidacja reguły: MAKSYMALNIE 3 PLACÓWKI
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

    // Walidacja: czy priorytety się nie dublują
    const orders = institutions.map(inst => inst.order);
    const hasDuplicates = new Set(orders).size !== orders.length;
    if (hasDuplicates) {
      res.status(400).json({ message: 'Każda placówka musi mieć unikalny priorytet (1, 2 lub 3)!' });
      return;
    }

    // 1. Czyszczenie starych preferencji dla tego wniosku
    await db.query('DELETE FROM application_institutions WHERE id_application = ?', [id_application]);

    // 2. Zapisywanie nowych preferencji
    for (const inst of institutions) {
      await db.query(
        'INSERT INTO application_institutions (id_application, id_institution, preference_order) VALUES (?, ?, ?)',
        [id_application, inst.id_institution, inst.order]
      );
    }

    res.status(200).json({ message: 'Preferencje placówek zostały pomyślnie zapisane!' });

  } catch (error: any) {
    console.error('Błąd podczas zapisu preferencji:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas zapisu preferencji.' });
  }
};