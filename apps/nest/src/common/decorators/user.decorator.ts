import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserPipe } from '../pipes/user.pipe';

export const User = (...args: string[]) => SetMetadata('user', args);

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    const userData = data ? user?.[data] : user;
    return userData;
  },
);

export const GetDBUser = (additionalOptions?: any) =>
  GetUser(additionalOptions, UserPipe);
