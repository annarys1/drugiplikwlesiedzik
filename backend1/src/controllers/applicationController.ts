import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const createApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
   
    const { id_children, id_institution, selectedCriteriaIds } = req.body;
    const parentId = req.user?.id;

    if (!id_children || !id_institution) {
      res.status(400).json({ message: 'Id dziecka oraz id placówki są wymagane!' });
      return;
    }

   
    let totalPoints = 0;
    if (selectedCriteriaIds && selectedCriteriaIds.length > 0) {
      const [criteria]: any = await db.query(
        'SELECT SUM(criterion_point) as total FROM criteria WHERE id_criterion IN (?)',
        [selectedCriteriaIds]
      );
      totalPoints = criteria[0].total || 0;
    }

 
    const [result]: any = await db.query(
      'INSERT INTO application (id_parent, id_children, id_institution, status, points) VALUES (?, ?, ?, ?, ?)',
      [parentId, id_children, id_institution, 'submitted', totalPoints]
    );

    const applicationId = result.insertId;

   
    if (selectedCriteriaIds && selectedCriteriaIds.length > 0) {
      const values = selectedCriteriaIds.map((id: number) => [applicationId, id]);
      await db.query('INSERT INTO application_criteria (id_application, id_criterion) VALUES ?', [values]);
    }

    res.status(201).json({ message: 'Wniosek złożony pomyślnie!', totalPoints });
  } catch (error: any) {
    console.error('Błąd składania wniosku:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas składania wniosku.' });
  }
};
export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id_application } = req.params; // ID wniosku z adresu URL
    const { status } = req.body; // 'approved' lub 'rejected'

    // Prosta walidacja statusu
    const validStatuses = ['approved', 'rejected', 'submitted'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Nieprawidłowy status wniosku!' });
      return;
    }

    // Aktualizacja w bazie
    await db.query(
      'UPDATE application SET status = ? WHERE id_application = ?',
      [status, id_application]
    );

    res.status(200).json({ message: `Status wniosku zmieniony na: ${status}` });
  } catch (error: any) {
    console.error('Błąd zmiany statusu:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas aktualizacji statusu.' });
  }
};