export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}
