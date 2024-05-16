import { ConfigService } from '@nestjs/config';
import { TestBed, faker } from 'testing';
import { createExecutionContext } from '../../../test/utils/request';
import { CommonRequestHeader } from '../constants/request';
import { ApiKeyGuard } from './api.guard';

describe('ApiGuard', () => {
  describe('ApiKeyGuard', () => {
    let underTest: ApiKeyGuard;

    let apiKey: string;

    beforeEach(() => {
      apiKey = faker.create.string.uuid();

      const { unit } = TestBed.create(ApiKeyGuard)
        .mock(ConfigService)
        .using({
          get: jest.fn().mockReturnValue(apiKey),
        })
        .compile();

      underTest = unit;
    });

    it('should be defined', () => {
      expect(underTest).toBeDefined();
    });

    it('should return true for valid api key', async () => {
      expect(
        await underTest.canActivate(
          createExecutionContext({
            headers: {
              [CommonRequestHeader.API_KEY_HEADER]: apiKey,
            },
          }),
        ),
      ).toBe(true);
    });

    it('should return false for wrong api key', async () => {
      const value = await underTest.canActivate(
        createExecutionContext({
          headers: {
            [CommonRequestHeader.API_KEY_HEADER]: apiKey + 'wrong',
          },
        }),
      );

      expect(value).toBe(false);
    });

    it('should return false for missing header', async () => {
      const value = await underTest.canActivate(
        createExecutionContext({ headers: {} }),
      );

      expect(value).toBe(false);
    });
  });
});
