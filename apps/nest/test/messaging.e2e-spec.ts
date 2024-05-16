import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from 'testing';
import { CommonRequestHeader } from '../src/common/constants/request';
import { MailTemplates } from '../src/common/modules/messaging/mail/mail.constants';
import { SmsType } from '../src/common/modules/messaging/sms/sms.constants';
import { createApiMock } from './utils/api';
import { testAccessToken } from './utils/jwt';

const validUserToken = testAccessToken;

const validAPIToken = 'API_KEY_HEADER';

describe('Messaging/SMS (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createApiMock();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/messaging/sms/send [POST]', () => {
    it('/messaging/sms/send (CREATED)', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/sms/send')
        .set(CommonRequestHeader.API_KEY_HEADER, `${validAPIToken}`)
        .send({
          to: faker.create.phone.number(),
          template: SmsType.ACCOUNT_CREATED_CODE,
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.CREATED);
    });
    it('/v1/messaging/sms/send (FORBIDDEN)', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/sms/send')
        .send({
          to: faker.create.phone.number(),
          template: SmsType.ACCOUNT_CREATED_CODE,
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.FORBIDDEN);
    });
    it('/v1/messaging/sms/send (FORBIDDEN) AUTHORIZATION', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/sms/send')
        .set(CommonRequestHeader.AUTHORIZATION, `${validUserToken}`)
        .send({
          to: faker.create.phone.number(),
          template: SmsType.ACCOUNT_CREATED_CODE,
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.FORBIDDEN);
    });
    it('/v1/messaging/sms/send (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/sms/send')
        .set(CommonRequestHeader.API_KEY_HEADER, `${validAPIToken}`)
        .send({
          to: faker.create.phone.number(),
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});

describe('Messaging/Email (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createApiMock();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/messaging/email/send [POST]', () => {
    it('/messaging/email/send (CREATED)', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/email/send')
        .set(CommonRequestHeader.API_KEY_HEADER, `${validAPIToken}`)
        .send({
          to: faker.create.internet.email(),
          template: MailTemplates.ACCOUNT_CREATED,
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.CREATED);
    });
    it('/v1/messaging/email/send (FORBIDDEN)', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/email/send')
        .send({
          to: faker.create.phone.number(),
          template: MailTemplates.ACCOUNT_CREATED,
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.FORBIDDEN);
    });
    it('/v1/messaging/email/send (FORBIDDEN) AUTHORIZATION', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/email/send')
        .set(CommonRequestHeader.AUTHORIZATION, `${validUserToken}`)
        .send({
          to: faker.create.phone.number(),
          template: MailTemplates.ACCOUNT_CREATED,
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.FORBIDDEN);
    });
    it('/v1/messaging/email/send (BAD_REQUEST)', async () => {
      return request(app.getHttpServer())
        .post('/v1/messaging/email/send')
        .set(CommonRequestHeader.API_KEY_HEADER, `${validAPIToken}`)
        .send({
          to: faker.create.phone.number(),
          data: {
            code: faker.create.string.uuid(),
          },
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
