import { prisma } from '../../src/db/prisma';

export const clearDatabase = async () => {
  await prisma.dailyUsage.deleteMany();
  await prisma.resumeVersion.deleteMany();
  await prisma.resumeCollaborator.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
};
