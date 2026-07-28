import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import { LoginRequestBody, LoginResponse } from '../types/auth.types';

export async function login({ email, password }: LoginRequestBody): Promise<LoginResponse> {
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
