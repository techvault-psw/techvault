import { NextFunction, Request, Response, RequestHandler } from 'express';
import passport from '../passport';
import type { Role } from '../consts/types';
import type { ReqUser } from '../types/express';

export const authValidator = passport.authenticate('jwt', { session: false }) as RequestHandler;

export const roleValidator = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
    }

    const user = req.user as ReqUser

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso não autorizado'
      });
    }

    next();
  };
};
