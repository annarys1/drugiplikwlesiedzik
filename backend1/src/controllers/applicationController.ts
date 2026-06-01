import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const createApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const connection = await db.getConnection();
  try {
    const { id_children, id_institution, selectedCriteriaIds } = req.body;
    const parentId = req.user?.id;

    if (!id_children || !id_institution) {
      res.status(400).json({ message: 'Id dziecka oraz id placówki są wymagane!' });
      return;
    }

    await connection.beginTransaction();

    // 1. Sprawdzenie duplikatu
    const [existing]: any = await connection.query(
        'SELECT id_application FROM application WHERE id_children = ? AND id_institution = ?',
        [id_children, id_institution]
    );
    if (existing.length > 0) {
        await connection.rollback();
        res.status(400).json({ message: 'Wniosek dla tego dziecka do tej placówki już istnieje!' });
        return;
    }

    // 2. Obliczenie punktów
    let totalPoints = 0;
    if (selectedCriteriaIds && selectedCriteriaIds.length > 0) {
      const [criteria]: any = await connection.query(
        'SELECT SUM(criterion_point) as total FROM criteria WHERE id_criterion IN (?)',
        [selectedCriteriaIds]
      );
      totalPoints = criteria[0].total || 0;
    }

    // 3. Wstawienie wniosku
    const [result]: any = await connection.query(
      'INSERT INTO application (id_parent, id_children, id_institution, status, points) VALUES (?, ?, ?, ?, ?)',
      [parentId, id_children, id_institution, 'submitted', totalPoints]
    );

    const applicationId = result.insertId;

    // 4. Powiązanie kryteriów
    if (selectedCriteriaIds && selectedCriteriaIds.length > 0) {
      const values = selectedCriteriaIds.map((id: number) => [applicationId, id]);
      await connection.query('INSERT INTO application_criteria (id_application, id_criterion) VALUES ?', [values]);
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Wniosek złożony pomyślnie!', totalPoints });
  } catch (error: any) {
    await connection.rollback();
    console.error('Błąd składania wniosku:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas składania wniosku.' });
  } finally {
    connection.release();
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id_application } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['submitted', 'approved', 'rejected', 'correction_needed'];

    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({ message: 'Niepoprawny lub brakujący status!' });
      return;
    }

    await db.query(
      'UPDATE application SET status = ? WHERE id_application = ?',
      [status, id_application]
    );

    res.status(200).json({ message: 'Status wniosku zaktualizowany!' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};