import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp } from './setup.js';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `user-${Date.now()}@test.com`,
        password: 'password123',
        name: 'Test User',
        role: 'user',
      })
      .expect(201);

    expect(response.body.email).toContain('@test.com');
    expect(response.body.name).toBe('Test User');
    expect(response.body.role).toBe('user');
    expect(response.body.password).toBeUndefined();
  });

  it('should register an organizer', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `organizer-${Date.now()}@test.com`,
        password: 'password123',
        name: 'Test Organizer',
        role: 'organizer',
      })
      .expect(201);

    expect(response.body.role).toBe('organizer');
  });

  it('should login and return JWT', async () => {
    const email = `login-${Date.now()}@test.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Login User',
        role: 'user',
      })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'password123',
      })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
  });

  it('should reject wrong password', async () => {
    const email = `wrong-${Date.now()}@test.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Wrong Password User',
        role: 'user',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'wrong-password',
      })
      .expect(401);
  });
});