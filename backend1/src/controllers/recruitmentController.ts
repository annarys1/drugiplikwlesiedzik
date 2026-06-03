import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const runRecruitmentAlgorithm = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const connection = await db.getConnection();
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Brak uprawnień. Tylko administrator systemu może uruchomić rekrutację!' });
      return;
    }

    await connection.beginTransaction();

    // 1. Pobieramy placówki i ich maksymalną pojemność
    const [institutions]: any = await connection.query('SELECT id_institution, max_capacity FROM institution');
    const capacityMap = new Map<number, { max: number; current: number }>();
    for (const inst of institutions) {
      capacityMap.set(inst.id_institution, { max: inst.max_capacity, current: 0 });
    }

    // 2. Pobieramy wszystkie wnioski, które zostały złożone (status 'submitted')
    const [applications]: any = await connection.query(
      "SELECT id_application, id_children FROM application WHERE status = 'submitted'"
    );

    const results = [];

    for (const app of applications) {
      // Pobieramy preferencje kandydata, ale sortujemy je według obliczonych dedykowanych punktów (od najwyższej liczby)
      // W przypadku remisu punktowego, decyduje wyższy priorytet ustawiony przez rodzica (preference_order)
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
          // Przypisujemy dziecko do placówki, bo jest wolne miejsce
          await connection.query(
            "UPDATE application SET status = 'approved', id_institution_final = ? WHERE id_application = ?",
            [pref.id_institution, app.id_application]
          );
          cap.current++;
          allocated = true;
          results.push({ id_application: app.id_application, status: 'approved', institution: pref.id_institution });
          break; // Przypisane! Kończymy sprawdzanie kolejnych preferencji dla tego dziecka
        }
      }

      // Jeśli zabrakło miejsc we wszystkich 3 wybranych placówkach
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