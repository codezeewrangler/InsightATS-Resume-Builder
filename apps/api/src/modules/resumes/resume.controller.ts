import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import {
  addCollaborator,
  createResume,
  createVersion,
  getResume,
  listCollaborators,
  listResumes,
  listVersions,
  restoreVersion,
  updateResume,
} from './resume.service';

export const list = async (req: AuthRequest, res: Response) => {
  const resumes = await listResumes(req.user!.sub);
  res.json({ resumes });
};

export const create = async (req: AuthRequest, res: Response) => {
  const resume = await createResume(req.user!.sub, req.body);
  res.status(201).json({ resume });
};

export const get = async (req: AuthRequest, res: Response) => {
  const result = await getResume(req.user!.sub, req.params.id);
  res.json({ resume: result.resume, role: result.role });
};

export const update = async (req: AuthRequest, res: Response) => {
  const resume = await updateResume(req.user!.sub, req.params.id, req.body);
  res.json({ resume });
};

export const versions = async (req: AuthRequest, res: Response) => {
  const versions = await listVersions(req.user!.sub, req.params.id);
  res.json({ versions });
};

export const createVersionHandler = async (req: AuthRequest, res: Response) => {
  const version = await createVersion(req.user!.sub, req.params.id, req.body.content);
  res.status(201).json({ version });
};

export const restoreVersionHandler = async (req: AuthRequest, res: Response) => {
  const resume = await restoreVersion(req.user!.sub, req.params.id, req.params.versionId);
  res.json({ resume });
};

export const addCollaboratorHandler = async (req: AuthRequest, res: Response) => {
  const collaborator = await addCollaborator(req.user!.sub, req.params.id, req.body.email, req.body.role);
  res.status(201).json({ collaborator });
};

export const listCollaboratorsHandler = async (req: AuthRequest, res: Response) => {
  const collaborators = await listCollaborators(req.user!.sub, req.params.id);
  res.json({ collaborators });
};
