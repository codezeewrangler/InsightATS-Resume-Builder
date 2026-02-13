import { Request, Response } from 'express';
import { env } from '../../config/env';
import { AuthRequest } from '../../middleware/auth';
import { AppError } from '../../utils/errors';
import { loginUser, registerUser, refreshSession, revokeRefreshToken } from './auth.service';

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/api/auth',
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body as {
    email: string;
    password: string;
    fullName?: string;
  };

  const user = await registerUser(email, password, fullName);
  res.status(201).json({ user: { id: user.id, email: user.email, fullName: user.fullName } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const { user, accessToken, refreshToken } = await loginUser(email, password);

  setRefreshCookie(res, refreshToken);

  res.json({
    user: { id: user.id, email: user.email, fullName: user.fullName },
    accessToken,
  });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || (req.body as { refreshToken?: string })?.refreshToken;

  if (!token) {
    throw new AppError('Missing refresh token', 401);
  }

  const { user, accessToken, refreshToken } = await refreshSession(token);
  setRefreshCookie(res, refreshToken);

  res.json({
    user: { id: user.id, email: user.email, fullName: user.fullName },
    accessToken,
  });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || (req.body as { refreshToken?: string })?.refreshToken;
  if (token) {
    await revokeRefreshToken(token);
  }

  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.status(204).send();
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  res.json({ user: { id: req.user.sub, email: req.user.email } });
};
