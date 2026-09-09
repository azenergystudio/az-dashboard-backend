export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;

  user: {
    id: string;
    name: string;
    email: string;

    role: {
      id: string;
      name: string;
    };

    organization: {
      id: string;
      name: string;
    } | null;
  };
}