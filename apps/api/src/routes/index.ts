import { Router } from 'express';
import healthRoutes from '../modules/health/health.routes';
import authRoutes from '../modules/auth/auth.routes';
import resumeRoutes from '../modules/resumes/resume.routes';
import aiRoutes from '../modules/ai/ai.routes';
import usageRoutes from '../modules/usage/usage.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ai', aiRoutes);
router.use('/usage', usageRoutes);

export default router;
