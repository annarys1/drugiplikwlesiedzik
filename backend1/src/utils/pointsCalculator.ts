import db from '../config/db';

export const calculatePointsForInstitution = async (
  connection: any, 
  id_application: number,
  id_institution: number
): Promise<number> => {
  
  const [criteria]: any = await connection.query(
    `SELECT c.id_criterion, c.criterion_point, c.is_variable, ac.declared_value
     FROM application_criteria ac
     JOIN criteria c ON ac.id_criterion = c.id_criterion
     WHERE ac.id_application = ? AND (c.id_institution IS NULL OR c.id_institution = ?)`,
    [id_application, id_institution]
  );

  let totalPoints = 0;

  for (const criterion of criteria) {
    if (criterion.is_variable === 1) {

      totalPoints += (criterion.criterion_point * (criterion.declared_value || 0));
    } else {
      totalPoints += criterion.criterion_point;
    }
  }

  return totalPoints;
};