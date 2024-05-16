import { Module } from '@nestjs/common';
import { UserModule } from 'src/common/modules/user/user.module';
import { AuthProviderService } from '../common/modules/auth/auth-provider.service';
import { QRService } from '../common/services/qr.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [QRService, AuthService, AuthProviderService],
})
export class AuthModule {}
