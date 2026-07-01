import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';

export const getHeadmasterCriteria = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  try {
    const [criteria]: any = await db.query(
      `SELECT c.* FROM criteria c
       JOIN institution i ON c.id_institution = i.id_institution
       WHERE i.id_headmaster = ?`,
      [userId]
    );
    res.status(200).json(criteria);
  } catch (error: any) {
    res.status(500).json({ message: 'Błąd pobierania kryteriów.' });
  }
};
export const getCriteriaForInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      res.status(400).json({ message: 'Brak parametrów placówek.' });
      return;
    }

    const institutionIds = (ids as string).split(',').map(Number);

    const [criteria]: any = await db.query(
      'SELECT * FROM criteria WHERE id_institution IS NULL OR id_institution IN (?)',
      [institutionIds]
    );

    res.status(200).json(criteria);
  } catch (error: any) {
    console.error('Błąd pobierania kryteriów:', error.message);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania kryteriów.' });
  }
};

export const addCriterionByHeadmaster = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, points, is_variable, id_institution } = req.body;
  const userId = req.user?.id;

  try {
    const [rows]: any = await db.query(
      'SELECT id_institution FROM institution WHERE id_institution = ? AND id_headmaster = ?',
      [id_institution, userId]
    );

    if (rows.length === 0) {
      res.status(403).json({ message: 'Brak uprawnień do tej placówki!' });
      return;
    }

    await db.query(
      'INSERT INTO criteria (name, criterion_point, is_variable, id_institution, type) VALUES (?, ?, ?, ?, ?)',
      [name, points, is_variable, id_institution, 'local']
    );

    res.status(201).json({ message: 'Kryterium placówki dodane!' });
  } catch (error: any) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};

export const updateCriterionByHeadmaster = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  const { id } = req.params;
  const { name, points, is_variable } = req.body;

  const userId = req.user?.id;

  try {

    // sprawdzamy czy kryterium należy do jego placówki

    const [rows]: any = await db.query(
      `
      SELECT c.id_criterion
      FROM criteria c
      JOIN institution i 
      ON c.id_institution = i.id_institution
      WHERE c.id_criterion = ?
      AND i.id_headmaster = ?
      `,
      [id, userId]
    );


    if(rows.length === 0){
      res.status(403).json({
        message:"Brak uprawnień"
      });
      return;
    }


    await db.query(
      `
      UPDATE criteria
      SET name=?, criterion_point=?, is_variable=?
      WHERE id_criterion=?
      `,
      [
        name,
        points,
        is_variable,
        id
      ]
    );


    res.json({
      message:"Zaktualizowano kryterium"
    });


  } catch(error){

    res.status(500).json({
      message:"Błąd serwera"
    });

  }

};

export const deleteCriterionByHeadmaster = async(
 req: AuthenticatedRequest,
 res: Response
)=>{

 const {id}=req.params;
 const userId=req.user?.id;


 try{

 const [rows]:any = await db.query(
 `
 SELECT c.id_criterion
 FROM criteria c
 JOIN institution i
 ON c.id_institution=i.id_institution
 WHERE c.id_criterion=?
 AND i.id_headmaster=?
 `,
 [id,userId]
 );


 if(rows.length===0){
   res.status(403).json({
    message:"Brak uprawnień"
   });
   return;
 }


 await db.query(
 `
 DELETE FROM criteria
 WHERE id_criterion=?
 `,
 [id]
 );


 res.json({
  message:"Usunięto"
 });


 }catch(error){

 res.status(500).json({
  message:"Błąd serwera"
 });

 }

}
