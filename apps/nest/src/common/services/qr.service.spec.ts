import * as QRCode from 'qrcode';
import { QRCodeType, QRService, TextQRCodeType } from './qr.service';

describe('QRService', () => {
  let qrService: QRService;

  beforeEach(() => {
    qrService = new QRService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateQRCode', () => {
    it('should generate QR code as buffer', async () => {
      const spy = jest.spyOn(QRCode, 'toBuffer');

      expect(spy).not.toHaveBeenCalled();
      const result = await qrService.generateQRCode('TestText');
      expect(spy).toHaveBeenCalled();

      expect(result).toMatchSnapshot();
    });
  });

  describe('generateQRCodeData', () => {
    it('should generate QR code as data URL', async () => {
      const spy = jest.spyOn(QRCode, 'toDataURL');

      expect(spy).not.toHaveBeenCalled();
      const result = await qrService.generateQRCodeData('TestText');
      expect(spy).toHaveBeenCalled();

      expect(result).toMatchSnapshot();
    });
  });

  describe('generateQRCodeText', () => {
    it('should generate QR code as text with default type', async () => {
      const spy = jest.spyOn(QRCode, 'toString');
      expect(spy).not.toHaveBeenCalled();
      const result = await qrService.generateQRCodeText('TestText');
      expect(spy).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });

    it('should generate QR code as text with specified type', async () => {
      const spy = jest.spyOn(QRCode, 'toString');
      expect(spy).not.toHaveBeenCalled();
      const result = await qrService.generateQRCodeText(
        'TestText',
        TextQRCodeType.UTF8,
      );
      expect(spy).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });
  });

  describe('createQRCode', () => {
    it('should create QR code as image by default', async () => {
      const spy = jest.spyOn(QRCode, 'toBuffer');
      expect(spy).not.toHaveBeenCalled();
      const result = await qrService.createQRCode('TestText');
      expect(spy).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });

    it('should create QR code as specified type', async () => {
      const spy = jest.spyOn(QRCode, 'toDataURL');
      expect(spy).not.toHaveBeenCalled();
      const result = await qrService.createQRCode(
        'TestText',
        QRCodeType.DATA_URL,
      );
      expect(spy).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });

    it('should create QR code as text with specified type', async () => {
      const spy = jest.spyOn(QRCode, 'toString');
      expect(spy).not.toHaveBeenCalled();
      const result = await qrService.createQRCode(
        'TestText',
        QRCodeType.TEXT,
        TextQRCodeType.UTF8,
      );
      expect(spy).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });
  });
});
