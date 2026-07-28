import { api } from './api';
import { LoginPayload, LoginResponse } from '../types/auth.types';

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
}
