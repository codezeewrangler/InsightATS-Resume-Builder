import { z } from 'zod';

export const resumeAnalysisSchema = z.object({
  body: z.object({
    resumeText: z.string().min(1),
    jobDescription: z.string().optional(),
  }),
});
