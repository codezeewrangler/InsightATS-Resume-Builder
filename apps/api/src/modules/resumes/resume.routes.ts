import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  addCollaboratorHandler,
  create,
  createVersionHandler,
  get,
  list,
  listCollaboratorsHandler,
  restoreVersionHandler,
  update,
  versions,
} from './resume.controller';
import {
  collaboratorSchema,
  createResumeSchema,
  createVersionSchema,
  resumeIdSchema,
  restoreVersionSchema,
  updateResumeSchema,
} from './resume.schema';

const router = Router();

router.use(requireAuth);

router.get('/', list);
router.post('/', validate(createResumeSchema), create);
router.get('/:id', validate(resumeIdSchema), get);
router.patch('/:id', validate(updateResumeSchema), update);

router.get('/:id/versions', validate(resumeIdSchema), versions);
router.post('/:id/versions', validate(createVersionSchema), createVersionHandler);
router.post('/:id/versions/:versionId/restore', validate(restoreVersionSchema), restoreVersionHandler);

router.get('/:id/collaborators', validate(resumeIdSchema), listCollaboratorsHandler);
router.post('/:id/collaborators', validate(collaboratorSchema), addCollaboratorHandler);

export default router;
