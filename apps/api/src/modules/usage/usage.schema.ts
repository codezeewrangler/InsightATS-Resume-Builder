import { z } from 'zod';

export const freeTierUsageQuerySchema = z.object({
  query: z.object({
    resumeId: z.string().uuid().optional(),
  }),
});
