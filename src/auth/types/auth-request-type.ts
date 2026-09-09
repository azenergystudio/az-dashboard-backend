import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';


export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    roleId: string;
    roleName: string;
    organizationId?: string | null;
    sessionId: string;
  };
}