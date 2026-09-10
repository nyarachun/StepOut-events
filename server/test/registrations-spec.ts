import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';

import { createTestApp } from './setup.js';
import { User } from '../src/users/entities/user.entity.js';
import { Event } from '../src/events/entities/event.entity.js';
import { City } from '../src/cities/entities/city.entity.js';
import { Category } from '../src/categories/entities/category.entity.js';

describe('Registrations', () => {
  let app: INestApplication;

  let userToken: string;
  let eventId: number;

  beforeAll(async () => {
    app = await createTestApp();

    const userRepository = app.get(
      getRepositoryToken(User),
    );

    const eventRepository = app.get(
      getRepositoryToken(Event),
    );

    const cityRepository = app.get(
      getRepositoryToken(City),
    );

    const categoryRepository = app.get(
      getRepositoryToken(Category),
    );

    const city = await cityRepository.save({
      name: `Registration Test City ${Date.now()}`,
    });

    const category = await categoryRepository.save({
      name: `Registration Test Category ${Date.now()}`,
    });

    const organizerEmail =
      `registration-organizer-${Date.now()}@test.com`;

    const userEmail =
      `registration-user-${Date.now()}@test.com`;

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: organizerEmail,
        password: 'password123',
        name: 'Registration Organizer',
        role: 'organizer',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: userEmail,
        password: 'password123',
        name: 'Registration User',
        role: 'user',
      })
      .expect(201);

    const organizer = await userRepository.findOneBy({
      email: organizerEmail,
    });

    if (!organizer) {
      throw new Error('Organizer was not created');
    }

    const userLogin = await request(
      app.getHttpServer(),
    )
      .post('/auth/login')
      .send({
        email: userEmail,
        password: 'password123',
      })
      .expect(201);

    userToken = userLogin.body.access_token;

    const event = eventRepository.create({
      title: 'Registration Test Event',
      description: 'Registration test event description',
      date: new Date('2026-12-01T18:00:00'),
      address: 'Lviv',
      price: 100,
      capacity: 20,
      latitude: 49.8397,
      longitude: 24.0297,
      imageUrl: 'https://example.com/event.jpg',
      organizer,
      category,
      city,
    });

    const savedEvent =
      await eventRepository.save(event);

    eventId = savedEvent.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register user for event', async () => {
    await request(app.getHttpServer())
      .post('/registrations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        eventId,
      })
      .expect(201);
  });

  it('should not allow duplicate registration', async () => {
    await request(app.getHttpServer())
      .post('/registrations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        eventId,
      })
      .expect(409);
  });

  it('should return user registrations', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get('/registrations/me')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});