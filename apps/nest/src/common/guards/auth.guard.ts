import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { CommonErrorMessage } from '../constants/request';
import { JwtStrategyName } from '../modules/auth/constants';
import {
  extractFromHeader,
  extractPayloadFromJWT,
  isExpired,
} from '../utils/token';

@Injectable()
export class JWTAuthGuard extends AuthGuard(JwtStrategyName.JWT) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = extractPayloadFromJWT(token);

      const expires = payload.exp;

      if (isExpired(expires)) {
        throw new UnauthorizedException(CommonErrorMessage.TOKEN_EXPIRED);
      }
    } catch (e) {
      if (e.message === CommonErrorMessage.TOKEN_EXPIRED) {
        throw e;
      }
      throw new UnauthorizedException(CommonErrorMessage.INVALID_TOKEN);
    }

    return super.canActivate(context);
  }
}
