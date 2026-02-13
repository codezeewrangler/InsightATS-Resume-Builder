import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { freeTierUsageHandler } from './usage.controller';
import { freeTierUsageQuerySchema } from './usage.schema';

const router = Router();

router.get('/free-tier', requireAuth, validate(freeTierUsageQuerySchema), freeTierUsageHandler);

export default router;
