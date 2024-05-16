import { MailerService } from '@nestjs-modules/mailer';
import { TestBed } from 'testing';
import { ErrorReportingService } from '../../reporting/error-reporting.service';
import { MailingProcessor } from './mail.processor';

describe('MailProcessor', () => {
  let underTest: MailingProcessor;
  let mailerService: MailerService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(MailingProcessor)
      .mock(MailerService)
      .using({
        sendMail: jest.fn(),
      })
      .mock(ErrorReportingService)
      .using({
        captureException: jest.fn(),
      })
      .compile();

    underTest = unit;
    mailerService = unitRef.get(MailerService);
  });

  it('should be defined', () => {
    expect(underTest).toBeDefined();
    expect(mailerService).toBeDefined();
  });

  describe('handleSendEmail', () => {
    it('should send email', async () => {
      const email = 'email';
      const subject = 'subject';
      const template = 'template';
      const context = { context: 'context' };

      await underTest.handleSendEmail({
        data: {
          to: email,
          subject,
          template,
          context,
        },
      } as any);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject,
        template,
        context,
      });
    });
  });
});
