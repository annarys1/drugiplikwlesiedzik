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



export const updateCriterionByHeadmaster = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  

  const id = Number(req.params.id);
  const { criterion_point } = req.body;

  const userId = req.user?.id;


  try {

    const [rows]: any = await db.query(
      `
      SELECT c.id_criterion
      FROM criteria c
      JOIN institution i 
      ON c.id_institution = i.id_institution
      WHERE c.id_criterion = ?
      AND i.id_headmaster = ?
      AND c.is_variable = 1
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
      SET criterion_point=?
      WHERE id_criterion=?
      `,
      [
        criterion_point,
        id
      ]
    );


    res.json({
      message:"Zaktualizowano kryterium"
    });


  } catch(error:any){

  console.error("UPDATE ERROR:", error.message);
  console.error(error);

  res.status(500).json({
    message:"Błąd serwera",
    error: error.message
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


export const createHeadmasterCriterion = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {


  console.log("USER:", req.user);
  console.log("BODY:", req.body);


  try {


    const userId = req.user?.id;


    const {
      name,
      criterion_point
    } = req.body;



    if(!name || criterion_point === undefined){

      res.status(400).json({
        message:"Brak danych"
      });

      return;

    }



    // pobranie placówki dyrektora

    const [institution]: any = await db.query(
      `
      SELECT id_institution
      FROM institution
      WHERE id_headmaster = ?
      `,
      [userId]
    );



    console.log(
      "INSTITUTION:",
      institution
    );



    if(institution.length === 0){

      res.status(403).json({
        message:"Dyrektor nie ma przypisanej placówki"
      });

      return;

    }



    const institutionId =
      institution[0].id_institution;



    await db.query(
      `
      INSERT INTO criteria
      (
        name,
        criterion_point,
        is_variable,
        id_institution
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        criterion_point,
        1,
        institutionId
      ]
    );



    res.status(201).json({
      message:"Dodano kryterium"
    });



  } catch(error:any){


    console.error(
      "CREATE CRITERION ERROR:",
      error.message
    );


    res.status(500).json({
      message:"Błąd serwera"
    });


  }

};

export const getAdminCriteria = async (
  req: Request,
  res: Response
) => {

  try {

    const [rows] = await db.query(
      `
      SELECT *
      FROM criteria
      WHERE is_variable = false
      `
    );


    res.json(rows);


  } catch(error) {

    console.error(error);

    res.status(500).json({
      message:"Błąd pobierania kryteriów"
    });

  }

};

export const createAdminCriterion = async (req: Request, res: Response) => {
    const { name, criterion_point } = req.body;

    await db.query(
        `
        INSERT INTO criteria
        (
            name,
            criterion_point,
            is_variable,
            id_institution
        )
        VALUES (?, ?, 0, NULL)
        `,
        [name, criterion_point]
    );

    res.status(201).json({
        message: "Dodano"
    });
};

export const updateAdminCriterion = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {

  

  const id = Number(req.params.id);
  const { criterion_point } = req.body;

  const userId = req.user?.id;


  try {

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
      SET criterion_point=?
      WHERE id_criterion=?
      `,
      [
        criterion_point,
        id
      ]
    );


    res.json({
      message:"Zaktualizowano kryterium"
    });


  } catch(error:any){

  console.error("UPDATE ERROR:", error.message);
  console.error(error);

  res.status(500).json({
    message:"Błąd serwera",
    error: error.message
  });

}

};