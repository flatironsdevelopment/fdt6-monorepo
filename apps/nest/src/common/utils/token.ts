import { CommonRequestHeader } from '../constants/request';

export const extractPayloadFromJWT = (token: string) => {
  const base64Payload = token.split('.')[1];

  if (!base64Payload) {
    return null;
  }
  const payloadBuffer = Buffer.from(base64Payload, 'base64');
  const updatedJwtPayload = JSON.parse(payloadBuffer.toString());

  return updatedJwtPayload;
};

export const isExpired = (expires: number) => {
  return Date.now() >= expires * 1000;
};

export const extractFromHeader = (request: Request) => {
  const [type, token] =
    request.headers?.[CommonRequestHeader.AUTHORIZATION]?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
