export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}
