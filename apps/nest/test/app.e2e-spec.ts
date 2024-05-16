import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CognitoProviderService } from '../src/common/modules/auth/providers/cognito/cognito.service';
import { createApiMock } from './utils/api';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let cognito: CognitoProviderService;

  beforeEach(async () => {
    app = await createApiMock();
    cognito = await app.resolve<CognitoProviderService>(CognitoProviderService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect('Hello World!');
  });

  describe('/health (GET)', () => {
    it('should return health check with services down', () => {
      cognito.healthCheck = jest.fn().mockResolvedValueOnce({
        success: false,
        message: 'this.userPool.getClientId is not a function',
      });
      return request(app.getHttpServer())
        .get('/health')
        .expect(HttpStatus.OK)
        .expect({
          status: 'ok',
          info: {
            cognito: {
              status: 'down',
              success: false,
              message: 'this.userPool.getClientId is not a function',
            },
          },
          error: {},
          details: {
            cognito: {
              status: 'down',
              success: false,
              message: 'this.userPool.getClientId is not a function',
            },
          },
        });
    });
    it('should return health check with services up', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(HttpStatus.OK)
        .expect({
          status: 'ok',
          info: { cognito: { status: 'up', success: true } },
          error: {},
          details: { cognito: { status: 'up', success: true } },
        });
    });
  });
});
