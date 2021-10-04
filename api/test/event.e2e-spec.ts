import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';
import { createEventDto, eventStub } from './stubs/event.stub';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { userStub } from './stubs/users.stub';
import { UserDocument } from 'src/users/schemas/user.schema';
import { InsertOneResult, ObjectId } from 'mongodb';

describe('EventController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let accessToken: string;
  let user: InsertOneResult<UserDocument>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
    dbConnection = moduleFixture
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    await dbConnection.collection('users').deleteMany({});
    user = await dbConnection.collection('users').insertOne(userStub());
    accessToken = moduleFixture
      .get<AuthService>(AuthService)
      .login({ _id: user.insertedId }).access_token;
  });

  beforeEach(async () => {
    await dbConnection.collection('events').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET events', () => {
    it('should return list of all events', async () => {
      const stub = eventStub(user.insertedId);
      await dbConnection.collection('events').insertOne(stub);
      const response = await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${accessToken}`);

      delete stub.user;

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([
        {
          ...stub,
          date: stub.date.toISOString(),
        },
      ]);
    });

    it('should return an empty list if no events are created', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([]);
    });

    it('should return 401 Unauthorized if token is missing', async () => {
      const response = await request(app.getHttpServer()).get('/events');

      expect(response.status).toBe(401);
    });

    it('should return 401 Unauthorized if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer invalid_token`);

      expect(response.status).toBe(401);
    });
  });

  describe('/POST events', () => {
    it('should create new event', async () => {
      const event = createEventDto();
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(event);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({
        ...event,
        date: event.date.toISOString(),
        _id: expect.any(String),
      });

      const id = new ObjectId(response.body._id);
      const createdEvent = await dbConnection.collection('events').findOne(id);
      expect(createdEvent).toMatchObject({
        ...event,
        _id: id,
        user: user.insertedId,
      });
    });

    it('should return 400 Bad Request if a required field is missing', async () => {
      const event = createEventDto();
      delete event.firstName;
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(event);

      expect(response.status).toEqual(400);
    });

    it('should return 400 Bad Request if type of property is invalid', async () => {
      const event = { ...createEventDto(), date: 'nj13n1ji0' };
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(event);

      expect(response.status).toEqual(400);
    });

    it('should strip any extra fields', async () => {
      const event = createEventDto();
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...event, extra: true });

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({
        ...event,
        date: event.date.toISOString(),
        _id: expect.any(String),
      });
    });

    it('should return 401 Unauthorized if token is missing', async () => {
      const response = await request(app.getHttpServer()).post('/events');

      expect(response.status).toBe(401);
    });

    it('should return 401 Unauthorized if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer invalid_token`);

      expect(response.status).toBe(401);
    });
  });
});
