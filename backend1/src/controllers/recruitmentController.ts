import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

import { calculatePointsForInstitution } from '../utils/pointsCalculator'; 

export const runRecruitmentAlgorithm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const connection = await db.getConnection();
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Brak uprawnień. Tylko administrator systemu może uruchomić rekrutację!' });
      return;
    }

    await connection.beginTransaction();


    const [institutions]: any = await connection.query('SELECT id_institution, max_capacity FROM institution');
    const capacityMap = new Map<number, { max: number; current: number }>();
    for (const inst of institutions) {
      capacityMap.set(inst.id_institution, { max: inst.max_capacity, current: 0 });
    }

    const [applications]: any = await connection.query(
      "SELECT id_application, id_children FROM application WHERE status = 'submitted'"
    );

    for (const app of applications) {
      const [preferences]: any = await connection.query(
        "SELECT id_institution FROM application_institutions WHERE id_application = ?",
        [app.id_application]
      );

      for (const pref of preferences) {

        const points = await calculatePointsForInstitution(connection, app.id_application, pref.id_institution);
        
        await connection.query(
          `UPDATE application_institutions 
           SET calculated_points = ? 
           WHERE id_application = ? AND id_institution = ?`,
          [points, app.id_application, pref.id_institution]
        );
      }
    }
    

    const [sortedApplications]: any = await connection.query(
      `SELECT a.id_application, a.id_children, MAX(ai.calculated_points) as max_points
       FROM application a
       JOIN application_institutions ai ON a.id_application = ai.id_application
       WHERE a.status = 'submitted'
       GROUP BY a.id_application
       ORDER BY max_points DESC`
    );

    const results = [];

    for (const app of sortedApplications) {
      const [preferences]: any = await connection.query(
        `SELECT id_institution, preference_order, calculated_points 
         FROM application_institutions 
         WHERE id_application = ? 
         ORDER BY calculated_points DESC, preference_order ASC`, 
        [app.id_application]
      );

      let allocated = false;

      for (const pref of preferences) {
        const cap = capacityMap.get(pref.id_institution);
        if (cap && cap.current < cap.max) {
          await connection.query(
            "UPDATE application SET status = 'approved', id_institution_final = ? WHERE id_application = ?",
            [pref.id_institution, app.id_application]
          );
          cap.current++;
          allocated = true;
          results.push({ id_application: app.id_application, status: 'approved', institution: pref.id_institution });
          break; 
        }
      }

      if (!allocated) {
        await connection.query(
          "UPDATE application SET status = 'rejected' WHERE id_application = ?",
          [app.id_application]
        );
        results.push({ id_application: app.id_application, status: 'rejected', reason: 'Brak miejsc w wybranych placówkach' });
      }
    }

    await connection.commit();
    res.status(200).json({ message: 'Rekrutacja zakończona sukcesem!', data: results });

  } catch (error: any) {
    await connection.rollback();
    console.error('Błąd algorytmu:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas wykonywania algorytmu rekrutacji.' });
  } finally {
    connection.release();
  }
};