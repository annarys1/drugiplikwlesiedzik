import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[2]; 


  const directToken = token || authHeader;

  if (!directToken) {
    res.status(401).json({ message: 'Brak tokenu autoryzacji, dostęp zabroniony!' });
    return;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'super_tajny_klucz_rezerwowy';
    const decoded = jwt.verify(directToken, JWT_SECRET) as any;
    

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next(); 
  } catch (error) {
    res.status(403).json({ message: 'Błędny lub nieaktywny token!' });
  }
};