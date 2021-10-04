import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EventsModule } from '../src/events/events.module';
import { EventsService } from '../src/events/events.service';

describe('EventController (e2e)', () => {
  let app: INestApplication;
  const eventService = { create: () => ({}) };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EventsModule],
    })
      .overrideProvider(EventsService)
      .useValue(eventService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST event', () => {
    return request(app.getHttpServer())
      .post('/event')
      .send({
        firstName: 'Dawid',
        lastName: 'Gąbka',
        email: 'gabka.daw@gmail.com',
        date: 'some date',
      })
      .expect(200);
  });
});
