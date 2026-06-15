import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import db from '../config/db';


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [users]: any = await db.query(
      'SELECT id_user, email, name, surname, role FROM user'
    );

    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Błąd pobierania użytkowników' });
  }
};


export const updateUserRole = async (req: Request, res: Response) => {
  try {
    
    const body = req.body as unknown as { id_user: number; role: string };

    const { id_user, role } = body;
     
    await db.query(
      'UPDATE user SET role = ? WHERE id_user = ?',
      [role, id_user]
    );

    res.status(200).json({ message: 'Rola zaktualizowana' });
  } catch (error: any) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};