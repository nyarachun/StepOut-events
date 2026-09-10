import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './setup.js';

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject /users/me without JWT', async () => {
    await request(app.getHttpServer())
      .get('/users/me')
      .expect(401);
  });

  it('should return current user with valid JWT', async () => {
    const email = `me-${Date.now()}@test.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Me User',
        role: 'user',
      })
      .expect(201);

    const loginResponse = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email,
        password: 'password123',
      })
      .expect(201);

    const token = loginResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.email).toBe(email);
    expect(response.body.name).toBe('Me User');
    expect(response.body.password).toBeUndefined();
  });
});