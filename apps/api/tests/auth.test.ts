import request from 'supertest';
import { beforeEach } from 'vitest';
import { app } from '../src/app';
import { clearDatabase } from './helpers/db';

describe('auth flow', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('registers and logs in a user', async () => {
    const email = `user_${Date.now()}@example.com`;
    const password = 'Password123!';

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ email, password, fullName: 'Test User' });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeTruthy();
  });
});
