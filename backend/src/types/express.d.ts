import type { Request } from 'express';
import type { ClienteSchema } from '../models/cliente';

declare global {
  namespace Express {
    interface User extends ClienteSchema {}
    interface Request {
      user: ClienteSchema;
    }
  }
}
