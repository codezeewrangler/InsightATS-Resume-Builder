import { z } from 'zod';

export const createResumeSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.any().optional(),
  }),
});

export const resumeIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const updateResumeSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.any().optional(),
    createVersion: z.boolean().optional(),
  }),
});

export const createVersionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    content: z.any().optional(),
  }),
});

export const restoreVersionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
    versionId: z.string().uuid(),
  }),
});

export const collaboratorSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    email: z.string().email(),
    role: z.enum(['editor', 'viewer']),
  }),
});
