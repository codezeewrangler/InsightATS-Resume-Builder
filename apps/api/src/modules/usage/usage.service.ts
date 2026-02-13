import { FREE_TIER_LIMITS, getNextUtcReset, getUtcDayStart } from '../../config/freeTier';
import { prisma } from '../../db/prisma';
import { AppError, FreeTierLimitError } from '../../utils/errors';

const getTodayUsage = async (userId: string, now = new Date()) => {
  const dateUtc = getUtcDayStart(now);
  return prisma.dailyUsage.findUnique({
    where: {
      userId_dateUtc: {
        userId,
        dateUtc,
      },
    },
  });
};

export const ensureResumeQuota = async (userId: string) => {
  const current = await prisma.resume.count({ where: { ownerId: userId } });
  if (current >= FREE_TIER_LIMITS.resumesPerUser) {
    throw new FreeTierLimitError('Resume limit reached for free tier', {
      resource: 'resumes',
      limit: FREE_TIER_LIMITS.resumesPerUser,
      current,
    });
  }
};

export const ensureVersionQuota = async (resumeId: string) => {
  const current = await prisma.resumeVersion.count({ where: { resumeId } });
  if (current >= FREE_TIER_LIMITS.versionsPerResume) {
    throw new FreeTierLimitError('Version limit reached for free tier', {
      resource: 'versions',
      limit: FREE_TIER_LIMITS.versionsPerResume,
      current,
    });
  }
};

export const ensureCollaboratorQuota = async (resumeId: string) => {
  const current = await prisma.resumeCollaborator.count({
    where: {
      resumeId,
      role: {
        in: ['editor', 'viewer'],
      },
    },
  });

  if (current >= FREE_TIER_LIMITS.collaboratorsPerResume) {
    throw new FreeTierLimitError('Collaborator limit reached for free tier', {
      resource: 'collaborators',
      limit: FREE_TIER_LIMITS.collaboratorsPerResume,
      current,
    });
  }
};

export const ensureAiQuota = async (userId: string, now = new Date()) => {
  const usage = await getTodayUsage(userId, now);
  const current = usage?.aiAnalysisCount ?? 0;

  if (current >= FREE_TIER_LIMITS.aiPerDay) {
    throw new FreeTierLimitError('Daily AI analysis limit reached for free tier', {
      resource: 'aiAnalysis',
      limit: FREE_TIER_LIMITS.aiPerDay,
      current,
      resetAtUtc: getNextUtcReset(now).toISOString(),
    });
  }
};

export const consumeAiQuota = async (userId: string, now = new Date()) => {
  const dateUtc = getUtcDayStart(now);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.dailyUsage.upsert({
      where: {
        userId_dateUtc: {
          userId,
          dateUtc,
        },
      },
      update: {},
      create: {
        userId,
        dateUtc,
        aiAnalysisCount: 0,
      },
    });

    const result = await tx.dailyUsage.updateMany({
      where: {
        userId,
        dateUtc,
        aiAnalysisCount: { lt: FREE_TIER_LIMITS.aiPerDay },
      },
      data: {
        aiAnalysisCount: { increment: 1 },
      },
    });

    if (result.count === 0) {
      const current = await tx.dailyUsage.findUnique({
        where: {
          userId_dateUtc: {
            userId,
            dateUtc,
          },
        },
        select: { aiAnalysisCount: true },
      });

      throw new FreeTierLimitError('Daily AI analysis limit reached for free tier', {
        resource: 'aiAnalysis',
        limit: FREE_TIER_LIMITS.aiPerDay,
        current: current?.aiAnalysisCount ?? FREE_TIER_LIMITS.aiPerDay,
        resetAtUtc: getNextUtcReset(now).toISOString(),
      });
    }

    return tx.dailyUsage.findUnique({
      where: {
        userId_dateUtc: {
          userId,
          dateUtc,
        },
      },
      select: { aiAnalysisCount: true },
    });
  });

  return updated?.aiAnalysisCount ?? 0;
};

export const getFreeTierUsage = async (userId: string, resumeId?: string) => {
  const now = new Date();
  const todayUsage = await getTodayUsage(userId, now);
  const resumesUsed = await prisma.resume.count({ where: { ownerId: userId } });

  let versionsUsedForActiveResume: number | undefined;
  let collaboratorsUsedForActiveResume: number | undefined;

  if (resumeId) {
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        OR: [
          { ownerId: userId },
          { collaborators: { some: { userId } } },
        ],
      },
      select: { id: true },
    });

    if (!resume) {
      throw new AppError('Access denied to requested resume usage', 403);
    }

    const [versionsUsed, collaboratorsUsed] = await Promise.all([
      prisma.resumeVersion.count({ where: { resumeId } }),
      prisma.resumeCollaborator.count({
        where: {
          resumeId,
          role: { in: ['editor', 'viewer'] },
        },
      }),
    ]);

    versionsUsedForActiveResume = versionsUsed;
    collaboratorsUsedForActiveResume = collaboratorsUsed;
  }

  return {
    limits: FREE_TIER_LIMITS,
    usage: {
      aiUsedToday: todayUsage?.aiAnalysisCount ?? 0,
      resumesUsed,
      versionsUsedForActiveResume,
      collaboratorsUsedForActiveResume,
    },
    resetAtUtc: getNextUtcReset(now).toISOString(),
  };
};
