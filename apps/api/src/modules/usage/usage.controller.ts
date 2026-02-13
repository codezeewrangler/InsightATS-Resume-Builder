import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { getFreeTierUsage } from './usage.service';

export const freeTierUsageHandler = async (req: AuthRequest, res: Response) => {
  const resumeId = req.query.resumeId as string | undefined;
  const payload = await getFreeTierUsage(req.user!.sub, resumeId);
  res.json(payload);
};
