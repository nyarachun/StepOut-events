import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './setup.js';

describe('Categories', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return categories without authentication', async () => {
    await request(app.getHttpServer())
      .get('/categories')
      .expect(200);
  });

  it('should not allow regular user to create a category', async () => {
    const email = `category-user-${Date.now()}@test.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Category User',
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
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Category ${Date.now()}`,
      })
      .expect(403);
  });
});