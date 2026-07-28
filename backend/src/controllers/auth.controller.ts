import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import * as authService from '../services/auth.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    throw ApiError.badRequest('Please provide a valid email address');
  }

  const result = await authService.login({ email, password });

  res.status(200).json(result);
});
