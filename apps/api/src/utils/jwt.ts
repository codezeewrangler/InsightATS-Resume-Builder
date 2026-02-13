import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';

export interface JwtPayload {
  sub: string;
  email: string;
}

const accessExpiresIn = env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'];
const refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'];

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: accessExpiresIn });

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: refreshExpiresIn });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;

export const decodeTokenExpiry = (token: string) => {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) {
    return null;
  }
  return new Date(decoded.exp * 1000);
};
