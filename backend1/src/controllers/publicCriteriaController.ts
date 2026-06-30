import { Request, Response } from 'express';
import db from '../config/db';

export const getAllCriteriaPublic = async (req: Request, res: Response): Promise<void> => {
  try {
   
    const [criteria]: any = await db.query('SELECT * FROM criteria');
    res.status(200).json(criteria);
  } catch (error: any) {
    res.status(500).json({ message: 'Błąd pobierania danych.' });
  }
};
