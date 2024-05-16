import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

export enum TextQRCodeType {
  SVG = 'svg',
  UTF8 = 'utf8',
  TERMINAL = 'terminal',
}

export enum QRCodeType {
  IMAGE = 'image',
  DATA_URL = 'data-url',
  TEXT = 'text',
}

const opts = {
  color: {
    dark: '#2A52A9',
    light: '#f7fafc',
  },
};

@Injectable()
export class QRService {
  async generateQRCode(text: string): Promise<string> {
    return QRCode.toBuffer(text, opts);
  }

  async generateQRCodeData(text: string): Promise<string> {
    return QRCode.toDataURL(text, opts);
  }

  async generateQRCodeText(
    text: string,
    type: TextQRCodeType = TextQRCodeType.SVG,
  ): Promise<string> {
    return QRCode.toString(text, { ...opts, type });
  }

  async createQRCode(
    text: string,
    exportType: QRCodeType = QRCodeType.IMAGE,
    type?: TextQRCodeType,
  ): Promise<string> {
    switch (exportType) {
      case QRCodeType.IMAGE:
        return this.generateQRCode(text);
      case QRCodeType.DATA_URL:
        return this.generateQRCodeData(text);
      case QRCodeType.TEXT:
        return this.generateQRCodeText(text, type);
      default:
        return this.generateQRCode(text);
    }
  }
}
