import { ConfigService } from '@nestjs/config';
import { TestBed } from 'testing';
import { createConfigMock } from '../../../../test/utils/config';
import { ErrorReportingService } from './error-reporting.service';

describe('ErrorReportingService', () => {
  let underTest: ErrorReportingService;
  let configService: ConfigService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ErrorReportingService)
      .mock(ConfigService)
      .using(
        createConfigMock({
          NODE_ENV: 'production',
        }),
      )
      .compile();

    underTest = unit;
    configService = unitRef.get(ConfigService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('captureException', () => {
    it('should call service', async () => {
      const spy = jest.spyOn((underTest as any).logger, 'error');

      const error = new Error('Error');

      expect(spy).not.toHaveBeenCalled();
      await underTest.captureException(error);
      expect(spy).toHaveBeenLastCalledWith(`Report to Service ${error}`);
    });

    it('should not call service', async () => {
      const spy = jest.spyOn((underTest as any).logger, 'error');

      (configService.get as any).mockImplementation((key) => {
        const env = {
          NODE_ENV: 'development',
        };

        return env[key];
      });

      const error = new Error('Error');

      expect(spy).not.toHaveBeenCalled();
      await underTest.captureException(error);
      expect(spy).toHaveBeenLastCalledWith(error);
    });
  });
});
