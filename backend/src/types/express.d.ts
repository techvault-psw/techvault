import type { Request } from 'express';
import type { Role } from '../consts/types';

type ReqUser = {
  id: string,
  role: Role,
}

declare global {
  namespace Express {
    interface User extends ReqUser {}
    interface Request { user: ReqUser }
  }
}
