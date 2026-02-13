import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/db/prisma';
import { clearDatabase } from './helpers/db';

const registerAndLogin = async (email: string, password = 'Password123!') => {
  await request(app)
    .post('/api/auth/register')
    .send({ email, password, fullName: 'Test User' })
    .expect(201);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
    .expect(200);

  return loginRes.body.accessToken as string;
};

describe('free-tier quotas', () => {
  beforeEach(async () => {
    await clearDatabase();
    vi.useRealTimers();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
  });

  it('blocks creating a 4th owned resume', async () => {
    const token = await registerAndLogin(`resume-limit-${Date.now()}@example.com`);

    for (let index = 0; index < 3; index += 1) {
      await request(app)
        .post('/api/resumes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: `Resume ${index + 1}`, content: {} })
        .expect(201);
    }

    const response = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Resume 4', content: {} })
      .expect(429);

    expect(response.body).toMatchObject({
      code: 'FREE_TIER_LIMIT_REACHED',
      resource: 'resumes',
      limit: 3,
      current: 3,
    });
  });

  it('blocks creating a 21st version for a resume', async () => {
    const token = await registerAndLogin(`version-limit-${Date.now()}@example.com`);

    const resume = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Versioned Resume', content: {} })
      .expect(201);

    const resumeId = resume.body.resume.id as string;

    for (let index = 0; index < 20; index += 1) {
      await request(app)
        .post(`/api/resumes/${resumeId}/versions`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: { version: index + 1 } })
        .expect(201);
    }

    const response = await request(app)
      .post(`/api/resumes/${resumeId}/versions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: { version: 21 } })
      .expect(429);

    expect(response.body).toMatchObject({
      code: 'FREE_TIER_LIMIT_REACHED',
      resource: 'versions',
      limit: 20,
      current: 20,
    });
  });

  it('blocks adding a 3rd non-owner collaborator', async () => {
    const ownerToken = await registerAndLogin(`owner-${Date.now()}@example.com`);

    const resume = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Collaborative Resume', content: {} })
      .expect(201);

    const resumeId = resume.body.resume.id as string;

    const collaboratorEmails = [
      `collab1-${Date.now()}@example.com`,
      `collab2-${Date.now()}@example.com`,
      `collab3-${Date.now()}@example.com`,
    ];

    for (const email of collaboratorEmails) {
      await registerAndLogin(email);
    }

    await request(app)
      .post(`/api/resumes/${resumeId}/collaborators`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: collaboratorEmails[0], role: 'editor' })
      .expect(201);

    await request(app)
      .post(`/api/resumes/${resumeId}/collaborators`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: collaboratorEmails[1], role: 'viewer' })
      .expect(201);

    const response = await request(app)
      .post(`/api/resumes/${resumeId}/collaborators`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: collaboratorEmails[2], role: 'editor' })
      .expect(429);

    expect(response.body).toMatchObject({
      code: 'FREE_TIER_LIMIT_REACHED',
      resource: 'collaborators',
      limit: 2,
      current: 2,
    });
  });

  it('blocks 11th AI analysis in a UTC day and resets quota next day', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-02-11T09:00:00Z'));

    const token = await registerAndLogin(`ai-limit-${Date.now()}@example.com`);

    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    atsScore: 80,
                    keywordMatchScore: 79,
                    formatQualityScore: 78,
                    impactScore: 77,
                    detectedSkills: [],
                    missingSkills: [],
                    foundKeywords: [],
                    missingKeywords: [],
                    atsIssues: [],
                    improvementSuggestions: [],
                  }),
                },
              },
            ],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      );

    vi.stubGlobal('fetch', fetchMock);

    for (let index = 0; index < 10; index += 1) {
      await request(app)
        .post('/api/ai/resume-analysis')
        .set('Authorization', `Bearer ${token}`)
        .send({ resumeText: 'Sample resume text' })
        .expect(200);
    }

    const blocked = await request(app)
      .post('/api/ai/resume-analysis')
      .set('Authorization', `Bearer ${token}`)
      .send({ resumeText: 'Sample resume text' })
      .expect(429);

    expect(blocked.body).toMatchObject({
      code: 'FREE_TIER_LIMIT_REACHED',
      resource: 'aiAnalysis',
      limit: 10,
      current: 10,
    });

    expect(fetchMock).toHaveBeenCalledTimes(10);

    vi.setSystemTime(new Date('2026-02-12T00:05:00Z'));

    await request(app)
      .post('/api/ai/resume-analysis')
      .set('Authorization', `Bearer ${token}`)
      .send({ resumeText: 'Sample resume text' })
      .expect(200);
  });

  it('denies usage endpoint without auth and returns usage with auth', async () => {
    await request(app).get('/api/usage/free-tier').expect(401);

    const token = await registerAndLogin(`usage-${Date.now()}@example.com`);

    const resume = await request(app)
      .post('/api/resumes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Usage Resume', content: {} })
      .expect(201);

    await request(app)
      .post(`/api/resumes/${resume.body.resume.id}/versions`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: { section: 'Summary' } })
      .expect(201);

    const usageRes = await request(app)
      .get(`/api/usage/free-tier?resumeId=${resume.body.resume.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(usageRes.body).toMatchObject({
      limits: {
        aiPerDay: 10,
        resumesPerUser: 3,
        versionsPerResume: 20,
        collaboratorsPerResume: 2,
      },
      usage: {
        aiUsedToday: 0,
        resumesUsed: 1,
        versionsUsedForActiveResume: 1,
        collaboratorsUsedForActiveResume: 0,
      },
    });

    const usageInDb = await prisma.dailyUsage.count();
    expect(usageInDb).toBe(0);
  });
});
