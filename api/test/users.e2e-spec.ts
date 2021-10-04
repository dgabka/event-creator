import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { userStub } from './stubs/users.stub';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;

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
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST users', () => {
    it('should create new user', async () => {
      const stub = userStub();
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(stub);

      delete stub.password;

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(stub);

      const user = await dbConnection
        .collection('users')
        .findOne({ email: stub.email });
      expect(user).toMatchObject({
        ...stub,
        password: expect.any(String),
      });
    });

    it('should return 409 Conflict if user with given email already exists', async () => {
      const stub = userStub();
      await dbConnection.collection('users').insertOne(userStub());
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(stub);

      expect(response.status).toEqual(409);
      expect(response.body).toMatchObject({
        message: 'Email address must be unique',
      });
    });

    it('should return 400 Bad Request if firstName is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userStub(), firstName: '' });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: ['firstName must be longer than or equal to 1 characters'],
      });
    });

    it('should return 400 Bad Request if firstName is longer than 32 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userStub(),
          firstName: Array.from({ length: 33 }).fill('a').join(),
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: ['firstName must be shorter than or equal to 32 characters'],
      });
    });

    it('should return 400 Bad Request if lastName is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...userStub(), lastName: '' });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: ['lastName must be longer than or equal to 1 characters'],
      });
    });

    it('should return 400 Bad Request if lastName is longer than 32 characters', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userStub(),
          lastName: Array.from({ length: 33 }).fill('a').join(),
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: ['lastName must be shorter than or equal to 32 characters'],
      });
    });

    it('should return 400 Bad Request if email address is not valid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userStub(),
          email: 'invalidEmail',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: ['email must be an email'],
      });
    });

    it('should return 400 Bad Request if email address is missing', async () => {
      const stub = userStub();
      delete stub.email;
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(stub);

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: expect.arrayContaining(['email should not be empty']),
      });
    });

    it('should return 400 Bad Request if password is too short', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userStub(),
          password: 'Test1',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: expect.arrayContaining([
          'password must be longer than or equal to 8 characters',
        ]),
      });
    });

    it('should return 400 Bad Request if password does not contain an uppercase letter', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userStub(),
          password: 'test@123',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: expect.arrayContaining([
          'password must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ regular expression',
        ]),
      });
    });

    it('should return 400 Bad Request if password does not contain a lowecase letter', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userStub(),
          password: 'TEST@123',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: expect.arrayContaining([
          'password must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ regular expression',
        ]),
      });
    });

    it('should return 400 Bad Request if password does not contain a number', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...userStub(),
          password: 'test@TEST',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toMatchObject({
        message: expect.arrayContaining([
          'password must match /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/ regular expression',
        ]),
      });
    });
  });
});
