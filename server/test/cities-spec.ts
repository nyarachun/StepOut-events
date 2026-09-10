import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './setup.js';

describe('Cities', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return cities without authentication', async () => {
    await request(app.getHttpServer())
      .get('/cities')
      .expect(200);
  });

  it('should not allow regular user to create a city', async () => {
    const email = `city-user-${Date.now()}@test.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'City User',
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

    await request(app.getHttpServer())
      .post('/cities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test City ${Date.now()}`,
      })
      .expect(403);
  });
});