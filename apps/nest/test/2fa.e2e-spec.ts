import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from 'testing';
import { createApiMock } from './utils/api';
import { testAccessToken } from './utils/jwt';

const accessToken = testAccessToken;

describe('TOTP 2FA (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApiMock();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/totp [GET]', () => {
    it('/auth/totp?qrType=text&qrFormat=svg (CREATED)', async () => {
      return request(app.getHttpServer())
        .get('/v1/auth/totp?qrType=text&qrFormat=svg')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);
    });
    it('/auth/totp?qrType=text&qrFormat=svg (UNAUTHORIZED)', async () => {
      return request(app.getHttpServer())
        .get('/v1/auth/totp?qrType=text&qrFormat=svg')
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('/auth/totp?qrType=text&qrFormat=svg (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .get('/v1/auth/totp?qrType=texts&qrFormat=svg')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
  describe('/auth/totp [POST]', () => {
    it('/auth/totp (OK)', async () => {
      return request(app.getHttpServer())
        .post('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('user-device', faker.create.string.uuid())
        .send({
          code: faker.create.string.uuid(),
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/totp (UNAUTHORIZED)', async () => {
      return request(app.getHttpServer())
        .post('/v1/auth/totp')
        .send({
          code: faker.create.string.uuid(),
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('/auth/totp (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .post('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('/auth/totp (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .post('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          code: 'wrong-code',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/totp [DELETE]', () => {
    it('/auth/totp (OK)', async () => {
      return request(app.getHttpServer())
        .delete('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          accessToken,
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/totp (UNAUTHORIZED)', async () => {
      return request(app.getHttpServer())
        .delete('/v1/auth/totp')
        .send({
          accessToken,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/auth/totp [PUT]', () => {
    it('/auth/totp (CREATED)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          code: faker.create.string.uuid(),
          user: faker.create.string.uuid(),
          session: faker.create.string.uuid(),
        })
        .expect(HttpStatus.CREATED);
    });
    it('/auth/totp (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          user: faker.create.string.uuid(),
          session: faker.create.string.uuid(),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('/auth/totp (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          code: faker.create.string.uuid(),
          session: faker.create.string.uuid(),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('/auth/totp (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/totp')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          user: faker.create.string.uuid(),
          code: faker.create.string.uuid(),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});

describe('SMS 2FA (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApiMock();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/sms [GET]', () => {
    it('/auth/sms (CREATED)', async () => {
      return request(app.getHttpServer())
        .get('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.CREATED);
    });
    it('/auth/sms (UNAUTHORIZED)', async () => {
      return request(app.getHttpServer())
        .get('/v1/auth/sms')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/auth/sms [POST]', () => {
    it('/auth/sms (OK)', async () => {
      return request(app.getHttpServer())
        .post('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          code: faker.create.string.uuid(),
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/sms (UNAUTHORIZED)', async () => {
      return request(app.getHttpServer())
        .post('/v1/auth/sms')
        .send({
          code: faker.create.string.uuid(),
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
    it('/auth/sms (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .post('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/sms [DELETE]', () => {
    it('/auth/sms (OK)', async () => {
      return request(app.getHttpServer())
        .delete('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          accessToken,
        })
        .expect(HttpStatus.OK);
    });
    it('/auth/sms (UNAUTHORIZED)', async () => {
      return request(app.getHttpServer())
        .delete('/v1/auth/sms')
        .send({
          accessToken,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/auth/sms [PUT]', () => {
    it('/auth/sms (CREATED)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          code: faker.create.string.uuid(),
          user: faker.create.string.uuid(),
          session: faker.create.string.uuid(),
        })
        .expect(HttpStatus.CREATED);
    });
    it('/auth/sms (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          user: faker.create.string.uuid(),
          session: faker.create.string.uuid(),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('/auth/sms (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          code: faker.create.string.uuid(),
          session: faker.create.string.uuid(),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('/auth/sms (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .put('/v1/auth/sms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          user: faker.create.string.uuid(),
          code: faker.create.string.uuid(),
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
