import { INestApplication } from '@nestjs/common';
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
  });
});
