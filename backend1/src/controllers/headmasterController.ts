import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';


export const getHeadmasterDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {

  try {

    const headmasterId = req.user?.id;

    if (!headmasterId) {
      res.status(401).json({
        message: "Brak użytkownika"
      });
      return;
    }


    // pobranie placówki dyrektora
    const [institutionRows]: any = await db.query(
      `
      SELECT 
        id_institution,
        name,
        city
      FROM institution
      WHERE id_headmaster = ?
      `,
      [headmasterId]
    );


    if (institutionRows.length === 0) {
      res.status(404).json({
        message: "Nie znaleziono placówki"
      });
      return;
    }


    const institution = institutionRows[0];


    // pobranie tylko wniosków tej placówki
    const [applications]: any = await db.query(
      `
      SELECT 
        *
      FROM application
      WHERE id_institution = ?
      `,
      [
        institution.id_institution
      ]
    );


    res.json({
      institution,
      applications
    });


  } catch(error:any){

    console.error(error);

    res.status(500).json({
      message:"Błąd serwera"
    });

  }

};