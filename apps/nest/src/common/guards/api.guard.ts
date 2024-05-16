import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { CommonRequestHeader } from '../constants/request';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers) {
      return false;
    }

    const apiKey = request.headers[CommonRequestHeader.API_KEY_HEADER];

    if (!apiKey) {
      return false;
    }

    const hasAccess = apiKey === this.configService.get('API_KEY_HEADER');

    if (!hasAccess) {
      return false;
    }

    return true;
  }
}
