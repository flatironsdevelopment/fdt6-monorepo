import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthProviderModule } from '../common/modules/auth/auth-provider.module';
import { AuthProviderName } from '../common/modules/auth/constants';
import { HealthController } from './health.controller';

@Module({
  imports: [
    HttpModule,
    TerminusModule,
    AuthProviderModule.forRoot(AuthProviderName.COGNITO),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
