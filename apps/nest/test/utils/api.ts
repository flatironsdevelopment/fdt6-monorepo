import { createMock } from '@golevelup/ts-jest';
import { getQueueOptionsToken, getQueueToken } from '@nestjs/bull';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue, QueueOptions } from 'bull';
import { QueueName } from '../../src/common/constants/queues';
import { AppModule } from './../../src/app.module';
import { createConfigMock } from './config';
import { jwksEndpoint } from './jwt';

export const createApiMock = async () => {
  const config = createConfigMock();

  const baseHost = `https://cognito-idp.${config.get(
    'AWS_REGION',
  )}.amazonaws.com/${config.get('AWS_COGNITO_USER_POOL_ID')}`;

  jwksEndpoint(baseHost);

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useValue(config)
    .overrideProvider(getQueueOptionsToken())
    .useValue(createMock<QueueOptions>())
    .overrideProvider(getQueueToken(QueueName.Mailing))
    .useValue(createMock<Queue>())
    .overrideProvider(getQueueToken(QueueName.Sms))
    .useValue(createMock<Queue>())
    .compile();

  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  return app;
};

export const createMockResponseObject = (response?: any) => {
  return {
    status: jest.fn().mockImplementation().mockReturnValue(200),
    json: jest.fn().mockImplementation().mockReturnValue(response),
    writeHead: jest.fn(),
    end: jest.fn().mockImplementation((response) => response),
  };
};
