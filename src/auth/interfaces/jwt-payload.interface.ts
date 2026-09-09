export interface JwtPayload {
  sub: string;             // User ID
  email: string;
  roleId: string;
  roleName: string;
  organizationId: string | null;
  sessionId: string;
}