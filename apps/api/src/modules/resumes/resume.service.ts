import { Prisma } from '@prisma/client';
import * as Y from 'yjs';

import { prisma } from '../../db/prisma';
import { AppError } from '../../utils/errors';
import { sanitizeObject, sanitizeText } from '../../utils/sanitize';
import {
  ensureCollaboratorQuota,
  ensureResumeQuota,
  ensureVersionQuota,
} from '../usage/usage.service';

type RequiredJsonInput = Prisma.InputJsonValue | Prisma.JsonNullValueInput;
type NullableJsonInput = Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;

const toNullableJson = (value: unknown): NullableJsonInput => {
  const sanitized = sanitizeObject(value);
  return sanitized === null ? Prisma.JsonNull : (sanitized as Prisma.InputJsonValue);
};

const toRequiredJson = (value: unknown): RequiredJsonInput => {
  const sanitized = sanitizeObject(value);
  return sanitized === null ? Prisma.JsonNull : (sanitized as Prisma.InputJsonValue);
};

const fromStoredJson = (value: Prisma.JsonValue): RequiredJsonInput =>
  value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);

const getResumeAccess = async (userId: string, resumeId: string) => {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      collaborators: { where: { userId } },
    },
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  if (resume.ownerId === userId) {
    return { resume, role: 'owner' as const };
  }

  const collaborator = resume.collaborators[0];
  if (!collaborator) {
    throw new AppError('Access denied', 403);
  }

  return { resume, role: collaborator.role };
};

const ensureEditAccess = async (userId: string, resumeId: string) => {
  const access = await getResumeAccess(userId, resumeId);
  if (access.role === 'viewer') {
    throw new AppError('Editor or owner role required', 403);
  }
  return access;
};

const getNextVersionNumber = async (resumeId: string) => {
  const latest = await prisma.resumeVersion.findFirst({
    where: { resumeId },
    orderBy: { versionNumber: 'desc' },
    select: { versionNumber: true },
  });

  return (latest?.versionNumber ?? 0) + 1;
};

export const listResumes = async (userId: string) =>
  prisma.resume.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId } } },
      ],
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      ownerId: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

export const createResume = async (userId: string, payload: { title?: string; content?: unknown }) => {
  await ensureResumeQuota(userId);

  const title = sanitizeText(payload.title ?? 'Untitled Resume');
  const content = payload.content !== undefined ? toNullableJson(payload.content) : undefined;
  const ydoc = new Y.Doc();
  const collabState = Buffer.from(Y.encodeStateAsUpdate(ydoc));

  const resume = await prisma.resume.create({
    data: {
      ownerId: userId,
      title,
      content,
      collabState,
    },
  });

  await prisma.resumeCollaborator.create({
    data: {
      resumeId: resume.id,
      userId,
      role: 'owner',
    },
  });

  return resume;
};

export const getResume = async (userId: string, resumeId: string) => {
  const { resume, role } = await getResumeAccess(userId, resumeId);
  return { resume, role };
};

export const updateResume = async (
  userId: string,
  resumeId: string,
  payload: { title?: string; content?: unknown; createVersion?: boolean },
) => {
  await ensureEditAccess(userId, resumeId);

  const data: Prisma.ResumeUpdateInput = {};
  if (payload.title !== undefined) {
    data.title = sanitizeText(payload.title);
  }
  if (payload.content !== undefined) {
    data.content = toNullableJson(payload.content);
  }

  const resume = await prisma.resume.update({
    where: { id: resumeId },
    data,
  });

  if (payload.createVersion && payload.content !== undefined) {
    await ensureVersionQuota(resumeId);
    const versionNumber = await getNextVersionNumber(resumeId);
    await prisma.resumeVersion.create({
      data: {
        resumeId,
        versionNumber,
        content: toRequiredJson(payload.content),
        createdById: userId,
      },
    });
  }

  return resume;
};

export const listVersions = async (userId: string, resumeId: string) => {
  await getResumeAccess(userId, resumeId);
  return prisma.resumeVersion.findMany({
    where: { resumeId },
    orderBy: { versionNumber: 'desc' },
    select: {
      id: true,
      versionNumber: true,
      createdAt: true,
      createdById: true,
    },
  });
};

export const createVersion = async (userId: string, resumeId: string, content?: unknown) => {
  await ensureEditAccess(userId, resumeId);
  await ensureVersionQuota(resumeId);

  const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  const versionNumber = await getNextVersionNumber(resumeId);
  const snapshotSource = content ?? resume.content ?? {};

  return prisma.resumeVersion.create({
    data: {
      resumeId,
      versionNumber,
      content: toRequiredJson(snapshotSource),
      createdById: userId,
    },
  });
};

export const restoreVersion = async (userId: string, resumeId: string, versionId: string) => {
  await ensureEditAccess(userId, resumeId);
  await ensureVersionQuota(resumeId);

  const version = await prisma.resumeVersion.findUnique({ where: { id: versionId } });
  if (!version || version.resumeId !== resumeId) {
    throw new AppError('Version not found', 404);
  }

  const restoredContent = fromStoredJson(version.content);

  const updated = await prisma.resume.update({
    where: { id: resumeId },
    data: {
      content: restoredContent,
    },
  });

  const versionNumber = await getNextVersionNumber(resumeId);
  await prisma.resumeVersion.create({
    data: {
      resumeId,
      versionNumber,
      content: restoredContent,
      createdById: userId,
    },
  });

  return updated;
};

export const addCollaborator = async (
  userId: string,
  resumeId: string,
  email: string,
  role: 'editor' | 'viewer',
) => {
  const access = await getResumeAccess(userId, resumeId);
  if (access.role !== 'owner') {
    throw new AppError('Only owners can manage collaborators', 403);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.id === access.resume.ownerId) {
    throw new AppError('Owner already has access', 409);
  }

  const existingCollaborator = await prisma.resumeCollaborator.findUnique({
    where: { resumeId_userId: { resumeId, userId: user.id } },
    select: { id: true },
  });

  if (!existingCollaborator) {
    await ensureCollaboratorQuota(resumeId);
  }

  return prisma.resumeCollaborator.upsert({
    where: { resumeId_userId: { resumeId, userId: user.id } },
    update: { role },
    create: { resumeId, userId: user.id, role },
  });
};

export const listCollaborators = async (userId: string, resumeId: string) => {
  await getResumeAccess(userId, resumeId);
  return prisma.resumeCollaborator.findMany({
    where: { resumeId },
    include: { user: { select: { id: true, email: true, fullName: true } } },
    orderBy: { createdAt: 'asc' },
  });
};
