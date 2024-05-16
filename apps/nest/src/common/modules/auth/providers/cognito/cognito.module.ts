import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategyName } from '../../constants';
import { CognitoProviderService } from './cognito.service';
import { CognitoJwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: JwtStrategyName.JWT })],
  providers: [CognitoProviderService, CognitoJwtStrategy],
})
export class CognitoModule {}
