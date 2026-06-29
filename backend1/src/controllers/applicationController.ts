import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const createApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const connection = await db.getConnection();
  try {
    const { id_children, selectedInstitutions, selectedCriteria } = req.body;
    const parentId = req.user?.id;

    if (!id_children) {
      res.status(400).json({ message: 'Id dziecka jest wymagane!' });
      return;
    }

    await connection.beginTransaction();

    // 1. Sprawdzenie duplikatu
    const [existing]: any = await connection.query(
        "SELECT id_application FROM application WHERE id_children = ? AND status != 'rejected'",
        [id_children]
    );
    if (existing.length > 0) {
        await connection.rollback();
        res.status(400).json({ message: 'Aktywny wniosek dla tego dziecka już istnieje w systemie!' });
        return;
    }

    // 2. Wstawienie wniosku ogólnego
    const [result]: any = await connection.query(
      'INSERT INTO application (id_parent, id_children, id_institution, status) VALUES (?, ?, NULL, ?)',
      [parentId, id_children, 'submitted']
    );

    const applicationId = result.insertId;

    // 3. Zapisanie wybranych placówek (preferencji)
    if (selectedInstitutions && selectedInstitutions.length > 0) {
      const instValues = selectedInstitutions.map((id_inst: number, index: number) => [
        applicationId, 
        id_inst, 
        index + 1
      ]);

      await connection.query(
        'INSERT INTO application_institutions (id_application, id_institution, preference_order) VALUES ?', 
        [instValues]
      );
    }

    // 4. Powiązanie wybranych kryteriów wraz z zadeklarowaną wartością
    if (selectedCriteria && selectedCriteria.length > 0) {
      const values = selectedCriteria.map((c: any) => [applicationId, c.id_criterion, c.declared_value || 0]);
      await connection.query(
        'INSERT INTO application_criteria (id_application, id_criterion, declared_value) VALUES ?', 
        [values]
      );
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Wniosek złożony pomyślnie!', id_application: applicationId });
  } catch (error: any) {
    await connection.rollback();
    console.error('Błąd składania wniosku:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas składania wniosku.' });
  } finally {
    connection.release();
  }
};


export const getDirectorApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const directorId = req.user?.id;

    if (!directorId) {
      res.status(401).json({ message: 'Brak autoryzacji' });
      return;
    }

    const [rows]: any = await db.query(
      `SELECT 
    a.id_application, 
    c.name AS first_name, 
    c.surname AS last_name, 
    a.status AS application_status,
    ai.preference_order
   FROM application a
   JOIN children c ON a.id_children = c.id_children
   JOIN application_institutions ai ON a.id_application = ai.id_application
   JOIN institution i ON ai.id_institution = i.id_institution
   WHERE i.id_headmaster = ? AND a.status != 'draft'
   ORDER BY a.id_application DESC`,
      [directorId]
    );
    res.status(200).json(rows);
  } catch (error: any) {
    console.error('Błąd pobierania wniosków dla dyrektora:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania wniosków.' });
  }
};

export const updateApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id_application } = req.params; 
    const { status } = req.body;
    const userId = req.user?.id;
    
    const allowedStatuses = ['submitted', 'approved', 'rejected', 'correction_needed'];

    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({ message: 'Niepoprawny lub brakujący status!' });
      return;
    }

    // WERYFIKACJA: Czy dyrektor zarządza chociaż jedną z placówek, które ten rodzic wybrał w preferencjach?
    const [rows]: any = await db.query(
      `SELECT ai.id_application 
       FROM application_institutions ai
       JOIN institution i ON ai.id_institution = i.id_institution
       WHERE ai.id_application = ? AND i.id_headmaster = ?`, 
       [id_application, userId]
    );

    if (rows.length === 0) {
      res.status(403).json({ message: 'Brak uprawnień do edycji wniosku tej placówki!' });
      return;
    }

    await db.query(
      'UPDATE application SET status = ? WHERE id_application = ?',
      [status, id_application]
    );

    res.status(200).json({ message: 'Status wniosku zaktualizowany!' });
  } catch (error: any) {
    console.error('Błąd zmiany statusu:', error.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const getParentApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id; // Pobieramy ID zalogowanego rodzica

    if (!parentId) {
      res.status(401).json({ message: 'Brak autoryzacji' });
      return;
    }

    const [rows]: any = await db.query(
      `SELECT 
    a.id_application, 
    c.name AS first_name, 
    c.surname AS last_name, 
    a.status,
    GROUP_CONCAT(CONCAT(ai.preference_order, ': ', i.name) ORDER BY ai.preference_order ASC SEPARATOR ', ') AS chosen_institutions
   FROM application a
   JOIN children c ON a.id_children = c.id_children
   LEFT JOIN application_institutions ai ON a.id_application = ai.id_application
   LEFT JOIN institution i ON ai.id_institution = i.id_institution
   WHERE a.id_parent = ? AND a.status != 'draft'
   GROUP BY a.id_application
   ORDER BY a.id_application DESC`, 
      [parentId]
    );

    res.status(200).json(rows);
  } catch (error: any) {
    console.error('Błąd pobierania wniosków rodzica:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania wniosków.' });
  }
};