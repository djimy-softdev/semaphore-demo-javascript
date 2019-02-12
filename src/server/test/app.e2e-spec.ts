import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { UsersService } from '../src/api/users/users.service';

describe('AppController (e2e)', () => {
  const user = {
    id: 1,
    username: 'test',
    description: 'test',
    age: null,
    firstName: null,
    lastName: null,
    createdAt: null,
    updatedAt: null,
  };
  const result = {
    findAll:  [
      {...user},
    ],
    findOne: {...user},
    remove: '',
    create: {...user},
    update: {...user},
  };
  let app: INestApplication;
  const usersService = {
    findAll: () => result.findAll,
    findOne: (id) => result.findOne,
    remove: (id) => result.remove,
    create: (item) => result.create,
    update: (id, item) => result.update,
  };

  beforeAll(async () => {
    const moduleFixture = await Test
      .createTestingModule({
        imports: [
          AppModule,
        ],
      })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('v1/api');
    await app.init();
  });

  it('/v1/api/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/api/users')
      .expect(200)
      .expect(JSON.stringify(result.findAll));
  });

  it(`/v1/api/users/${user.id} (DELETE)`, () => {
    return request(app.getHttpServer())
      .delete('/v1/api/users/1')
      .expect(200)
      .expect(result.remove);
  });

  it(`/v1/api/users/${user.id} (GET)`, () => {
    return request(app.getHttpServer())
      .get('/v1/api/users/1')
      .expect(200)
      .expect(JSON.stringify(result.findOne));
  });

  it(`/v1/api/users/${user.id} (PUT)`, () => {
    return request(app.getHttpServer())
      .put(`/v1/api/users/${user.id}`)
      .send(user)
      .expect(200)
      .expect(JSON.stringify(result.update));
  });

  it('/v1/api/users (POST)', () => {
    return request(app.getHttpServer())
      .post(`/v1/api/users`)
      .send(user)
      .expect(201)
      .expect(JSON.stringify(result.create));
  });

  afterAll(async () => {
    await app.close();
  });
});
