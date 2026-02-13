import crypto from 'crypto';
import { prisma } from '../../db/prisma';
import { AppError } from '../../utils/errors';
import { decodeTokenExpiry, signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { hashPassword, verifyPassword } from '../../utils/password';

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const registerUser = async (email: string, password: string, fullName?: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      fullName,
      passwordHash,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });
  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = decodeTokenExpiry(refreshToken) ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
    },
  });

  return { user, accessToken, refreshToken };
};

export const refreshSession = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);
  const refreshTokenHash = hashToken(refreshToken);

  const existing = await prisma.refreshToken.findFirst({
    where: {
      tokenHash: refreshTokenHash,
      revokedAt: null,
    },
  });

  if (!existing) {
    throw new AppError('Refresh token invalid or revoked', 401);
  }

  if (existing.userId !== payload.sub) {
    throw new AppError('Refresh token invalid', 401);
  }

  if (existing.expiresAt < new Date()) {
    throw new AppError('Refresh token expired', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const newAccessToken = signAccessToken({ sub: user.id, email: user.email });
  const newRefreshToken = signRefreshToken({ sub: user.id, email: user.email });
  const newRefreshHash = hashToken(newRefreshToken);
  const expiresAt = decodeTokenExpiry(newRefreshToken) ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const replacement = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: newRefreshHash,
      expiresAt,
      replacedByTokenId: null,
    },
  });

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: {
      revokedAt: new Date(),
      replacedByTokenId: replacement.id,
    },
  });

  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const revokeRefreshToken = async (refreshToken: string) => {
  const refreshTokenHash = hashToken(refreshToken);

  const existing = await prisma.refreshToken.findFirst({
    where: {
      tokenHash: refreshTokenHash,
      revokedAt: null,
    },
  });

  if (!existing) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });
};
