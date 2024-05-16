import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { FormatToken } from '../../../utils';
import { CognitoProviderService } from '../cognito.service';

@Injectable()
export class CognitoJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authProvider: CognitoProviderService,
  ) {
    const authority = `https://cognito-idp.${configService.get<string>(
      'AWS_REGION',
    )}.amazonaws.com/${configService.get<string>('AWS_COGNITO_USER_POOL_ID')}`;

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authority}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: authority,
      algorithms: ['RS256'],
      passReqToCallback: true,
    });
  }

  // Automatically set the user to the request object req.user
  public async validate(req: Request, payload: any) {
    if (!payload || !payload.sub) {
      return null;
    }

    try {
      const token = FormatToken(req.headers['authorization']);
      const user = await this.authProvider.getUserByToken(token);
      return user;
    } catch {
      return false;
    }
  }
}
