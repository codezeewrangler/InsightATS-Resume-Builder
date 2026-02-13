import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { analyzeResume } from './ai.service';

export const analyzeResumeHandler = async (req: AuthRequest, res: Response) => {
  const { resumeText, jobDescription } = req.body as { resumeText: string; jobDescription?: string };
  const analysis = await analyzeResume(req.user!.sub, resumeText, jobDescription);
  res.json({ analysis });
};
