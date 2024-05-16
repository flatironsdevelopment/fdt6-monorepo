import { ExecutionContext } from '@nestjs/common';

export const createExecutionContext = (
  request?: any,
  response?: any,
  next?: any,
): ExecutionContext => ({
  getClass: () => ({}) as any,
  getHandler: () => ({}) as any,
  getArgs: () => ({}) as any,
  getArgByIndex: () => ({}) as any,
  getType: () => ({}) as any,
  switchToRpc: () => ({}) as any,
  switchToWs: () => ({}) as any,
  switchToHttp: () => ({
    getNext: () => ({
      ...next,
    }),
    getResponse: () => ({
      ...response,
    }),
    getRequest: () => ({
      ...request,
    }),
  }),
});
