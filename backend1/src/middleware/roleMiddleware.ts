import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

export const checkRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   
    if (!req.user) {
      return res.status(401).json({ message: 'Brak autoryzacji!' });
    }

 
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Brak uprawnień: Dostęp tylko dla administratora!' });
    }

    next();
  };
};