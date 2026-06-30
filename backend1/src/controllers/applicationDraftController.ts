
import {Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';


export const saveDraft = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;
    const { id_children, id_institution, step, data } = req.body;

    if (!parentId) {
      res.status(401).json({ message: 'Brak autoryzacji' });
      return;
    }


    const [existing]: any = await db.query(
      'SELECT * FROM application WHERE id_parent = ? AND status = ?',
      [parentId, 'draft']
    );

    if (existing.length > 0) {

      await db.query(
        'UPDATE application SET id_children=?, id_institution=?, step=?, data=? WHERE id_parent=? AND status=?',
        [id_children, id_institution, step, JSON.stringify(data), parentId, 'draft']
      );
    } else {

      await db.query(
        'INSERT INTO application (id_parent, id_children, id_institution, status, step, data) VALUES (?, ?, ?, ?, ?, ?)',
        [parentId, id_children, id_institution, 'draft', step, JSON.stringify(data)]
      );
    }

    res.status(200).json({ message: 'Draft zapisany!' });

  } catch (error: any) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};


export const submitApplication = async (req: AuthenticatedRequest, res: Response) => {
  try{
  const { id } = req.params;

  await db.query(
    'UPDATE application SET status = ? WHERE id_application = ?',
    ['submitted', id]
  );

  res.json({ message: 'Wniosek złożony!' });}
  catch(errorz:any){
    res.status(500).json({message:'Błąd serwera'});
  }
};


export const getDraft = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.id;

    if (!parentId) {
      res.status(401).json({ message: 'Brak autoryzacji' });
      return;
    }

    const [rows]: any = await db.query(
      'SELECT * FROM application WHERE id_parent = ? AND status = ?',
      [parentId, 'draft']
    );

    res.status(200).json(rows[0] || null);

  } catch (error: any) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};