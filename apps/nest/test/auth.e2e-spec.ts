import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from 'testing';
import { createApiMock } from './utils/api';
import { testAccessToken } from './utils/jwt';

const accessToken = testAccessToken;

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApiMock();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('sign-up [POST]', () => {
    it('/auth/sign-up (CREATED)', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/sign-up')
        .send({
          email: faker.create.internet.email(),
          password: faker.create.internet.password(),
          firstName: faker.create.person.firstName(),
          lastName: faker.create.person.lastName(),
        })
        .expect(HttpStatus.CREATED);
    });
    it('/auth/sign-up (BAD_REQUEST)', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/sign-up')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('sign-in [POST]', () => {
    it('/auth/sign-in (OK)', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/sign-in')
        .send({
          email: faker.create.internet.email(),
          password: faker.create.internet.password(),
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('sign-out [DELETE]', () => {
    it('/auth/sign-out (OK)', () => {
      return request(app.getHttpServer())
        .delete('/v1/auth/sign-out')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          accessToken,
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/sign-out (UNAUTHORIZED)', () => {
      return request(app.getHttpServer())
        .delete('/v1/auth/sign-out')
        .send({
          accessToken,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('session [GET]', () => {
    it('/auth/session (OK)', () => {
      return request(app.getHttpServer())
        .get('/v1/auth/session')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
    it('/auth/session (UNAUTHORIZED)', () => {
      return request(app.getHttpServer())
        .get('/v1/auth/session')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('forgot-password [POST]', () => {
    it('/auth/forgot-password (CREATED)', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/forgot-password')
        .send({
          email: faker.create.internet.email(),
        })
        .expect(HttpStatus.CREATED);
    });
    it('/auth/forgot-password (BAD_REQUEST)', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/forgot-password')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('forgot-password [PUT]', () => {
    it('/auth/forgot-password (OK)', () => {
      return request(app.getHttpServer())
        .put('/v1/auth/forgot-password')
        .send({
          email: faker.create.internet.email(),
          code: faker.create.string.uuid(),
          password: faker.create.internet.password(),
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/forgot-password (BAD_REQUEST)', () => {
      return request(app.getHttpServer())
        .put('/v1/auth/forgot-password')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('change-password [PUT]', () => {
    it('/auth/change-password (OK)', () => {
      return request(app.getHttpServer())
        .put('/v1/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          oldPassword: faker.create.internet.password(),
          newPassword: faker.create.internet.password(),
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/change-password (UNAUTHORIZED)', () => {
      return request(app.getHttpServer())
        .put('/v1/auth/change-password')
        .send({
          oldPassword: faker.create.internet.password(),
          newPassword: faker.create.internet.password(),
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('refresh-token [POST]', () => {
    it('/auth/refresh-token (CREATED)', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/refresh-token')
        .send({
          token: accessToken,
        })
        .expect(HttpStatus.CREATED);
    });
    it('/auth/refresh-token (BAD_REQUEST)', () => {
      return request(app.getHttpServer())
        .post('/v1/auth/refresh-token')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('sign-up/confirm [PUT]', () => {
    it('/auth/sign-up/confirm (OK)', () => {
      return request(app.getHttpServer())
        .put('/v1/auth/sign-up/confirm')
        .send({
          email: faker.create.internet.email(),
          code: faker.create.string.uuid(),
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/sign-up/confirm (BAD_REQUEST)', () => {
      return request(app.getHttpServer())
        .put('/v1/auth/sign-up/confirm')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
