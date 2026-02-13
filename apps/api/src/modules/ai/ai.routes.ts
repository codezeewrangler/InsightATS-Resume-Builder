import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { analyzeResumeHandler } from './ai.controller';
import { resumeAnalysisSchema } from './ai.schema';

const router = Router();

router.post('/resume-analysis', requireAuth, validate(resumeAnalysisSchema), analyzeResumeHandler);

export default router;
