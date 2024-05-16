import { setups } from 'testing';
import { mockBuffer, mockDataUrl, mockText } from './mocks/qrcode';

setups.mockCognitoDependencies();

const mockDate = new Date('2023-12-06T18:00:00Z');

global.Date = jest.fn(() => mockDate) as any;
global.Date.now = jest.fn(() => mockDate.getTime()) as any;

jest.mock('qrcode', () => {
  const toBuffer = jest.fn().mockResolvedValue(mockBuffer);
  const toDataURL = jest.fn().mockResolvedValue(mockDataUrl);
  const toString = jest.fn().mockResolvedValue(mockText);

  return { toBuffer, toDataURL, toString };
});

jest.mock('twilio', () => ({
  Twilio: class {
    constructor() {
      return this;
    }

    messages = {
      create: jest.fn().mockImplementation(({ body, from, to }) =>
        Promise.resolve({
          body,
          numSegments: '2',
          direction: 'outbound-api',
          from,
          to,
          dateUpdated: '2023-12-12T00:00:00.000Z',
          price: null,
          errorMessage: null,
          uri: '/2010-04-01/Accounts/account-sid/Messages/message-id.json',
          accountSid: 'account-sid',
          numMedia: '0',
          status: 'queued',
          messagingServiceSid: null,
          sid: 'sid',
          dateSent: null,
          dateCreated: '2023-12-12T00:00:00.000Z',
          priceUnit: 'USD',
          apiVersion: '2010-04-01',
        }),
      ),
    };
  },
}));
