import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';

import { createTestApp } from './setup.js';
import { City } from '../src/cities/entities/city.entity.js';
import { Category } from '../src/categories/entities/category.entity.js';

describe('Events', () => {
  let app: INestApplication;

  let organizerToken: string;
  let userToken: string;

  let cityId: number;
  let categoryId: number;
  let eventId: number;

  beforeAll(async () => {
    app = await createTestApp();

    const cityRepository = app.get(
      getRepositoryToken(City),
    );

    const categoryRepository = app.get(
      getRepositoryToken(Category),
    );

    const city = await cityRepository.save({
      name: `Test City ${Date.now()}`,
    });

    const category = await categoryRepository.save({
      name: `Test Category ${Date.now()}`,
    });

    cityId = city.id;
    categoryId = category.id;

    const organizerEmail =
      `event-organizer-${Date.now()}@test.com`;

    const userEmail =
      `event-user-${Date.now()}@test.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: organizerEmail,
        password: 'password123',
        name: 'Event Organizer',
        role: 'organizer',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: userEmail,
        password: 'password123',
        name: 'Event User',
        role: 'user',
      })
      .expect(201);

    const organizerLogin = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: organizerEmail,
        password: 'password123',
      })
      .expect(201);

    const userLogin = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: userEmail,
        password: 'password123',
      })
      .expect(201);

    organizerToken =
      organizerLogin.body.access_token;

    userToken = userLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return events publicly', async () => {
    await request(app.getHttpServer())
      .get('/events')
      .expect(200);
  });

  it('should not allow regular user to create an event', async () => {
    await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'User Event',
        description: 'Test event',
        date: '2026-12-01T18:00:00',
        address: 'Lviv',
        price: 100,
        capacity: 20,
        latitude: 49.8397,
        longitude: 24.0297,
        categoryId,
        cityId,
      })
      .expect(403);
  });

  it('should allow organizer to create an event', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Test Event',
        description: 'Test event description',
        date: '2026-12-01T18:00:00',
        address: 'Lviv',
        price: 100,
        capacity: 20,
        latitude: 49.8397,
        longitude: 24.0297,
        categoryId,
        cityId,
      })
      .expect(201);

    eventId = response.body.id;

    expect(response.body.title).toBe('Test Event');
    expect(response.body.organizer).toBeDefined();
    expect(response.body.category).toBeDefined();
    expect(response.body.city).toBeDefined();
  });

  it('should return one event', async () => {
    await request(app.getHttpServer())
      .get(`/events/${eventId}`)
      .expect(200);
  });

  it('should allow organizer to update own event', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(`/events/${eventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Updated Test Event',
      })
      .expect(200);

    expect(response.body.title).toBe(
      'Updated Test Event',
    );
  });

  it('should not allow regular user to update event', async () => {
    await request(app.getHttpServer())
      .patch(`/events/${eventId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Hacked Event',
      })
      .expect(403);
  });

  it('should not allow regular user to delete event', async () => {
    await request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send()
      .expect(403);
  });
});