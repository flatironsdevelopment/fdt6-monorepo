import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/common/database/entities/user.entity';
import { SecuredEndpoint } from 'src/common/decorators/endpoint.decorator';
import { GenericResultResponse } from '../common/constants/open-api';
import { CommonRequestHeader } from '../common/constants/request';
import { RequestHeader } from '../common/decorators/header.decorator';
import { Public } from '../common/decorators/public.decorator';
import { GetDBUser, GetUser } from '../common/decorators/user.decorator';
import { QRCodeType } from '../common/services/qr.service';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ConfirmForgotPasswordDto,
  DeliveryInfoResponse,
  ForgotPasswordDto,
} from './dto/forgot-password.dto';
import {
  AuthTokenResponse,
  RefreshTokenDto,
  SessionUser,
  SignInDto,
} from './dto/sign-in.dto';
import {
  ConfirmSignUpDto,
  ResendEmailCodeDto,
  SignUpDto,
} from './dto/sign-up.dto';
import {
  AuthorizationDto,
  CodeDto,
  QRCodeDto,
  UserDeviceDto,
  VerifyCodeDto,
} from './dto/totp.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiTags('auth')
  @ApiOkResponse({
    description: 'Inits the sign in process.',
    type: AuthTokenResponse,
  })
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Public()
  @ApiTags('auth')
  @ApiCreatedResponse({
    description: 'A new user is created and confirmation email is sent.',
    type: GenericResultResponse,
  })
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Public()
  @ApiTags('auth')
  @ApiCreatedResponse({
    description: 'User sign up is confirmed.',
    type: GenericResultResponse,
  })
  @Put('sign-up/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmSignUp(@Body() body: ConfirmSignUpDto) {
    return await this.authService.confirmSignUp(body);
  }

  @ApiTags('auth')
  @ApiCreatedResponse({
    description: 'User sign up is confirmed.',
    type: GenericResultResponse,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Delete('sign-out')
  async signOut(@RequestHeader(AuthorizationDto) headers: AuthorizationDto) {
    return this.authService.signOut(headers.authorization);
  }

  @ApiTags('auth')
  @ApiOkResponse({
    description: 'Returns User Object.',
    type: SessionUser,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Get('session')
  async getSession(@GetDBUser() user) {
    return { user: User.mapToClient(user) };
  }

  @Public()
  @ApiTags('recovery')
  @ApiOkResponse({
    description: 'Starts user account recovery process.',
    type: DeliveryInfoResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body.email);
  }

  @Public()
  @ApiTags('recovery')
  @ApiOkResponse({
    description: 'Updates user password.',
    type: GenericResultResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Put('forgot-password')
  async confirmForgotPassword(@Body() body: ConfirmForgotPasswordDto) {
    return await this.authService.forgotPasswordSubmit(
      body.email,
      body.code,
      body.password,
    );
  }

  @ApiTags('recovery')
  @ApiOkResponse({
    description: 'Updates user password.',
    type: GenericResultResponse,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Put('change-password')
  async changePassword(
    @RequestHeader(AuthorizationDto) headers: AuthorizationDto,
    @Body() body: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      body.oldPassword,
      body.newPassword,
      headers.authorization,
    );
  }

  @Public()
  @ApiTags('auth')
  @ApiCreatedResponse({
    description: 'Creates a new access token.',
    type: AuthTokenResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.authService.refreshToken(body.token);
  }

  @Public()
  @ApiTags('auth')
  @ApiOkResponse({
    description: 'Resend verification code to email.',
    type: DeliveryInfoResponse,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('email/resend')
  async resendSignUp(@Body() body: ResendEmailCodeDto) {
    return await this.authService.resendEmail(body.email);
  }

  @ApiTags('2fa')
  @ApiCreatedResponse({
    description: 'Returns a QR Code on the requested format.',
    type: String,
  })
  @SecuredEndpoint(HttpStatus.CREATED)
  @Get('totp')
  async getTotpMfaSecret(
    @RequestHeader(AuthorizationDto) headers: AuthorizationDto,
    @GetUser() user,
    @Query() query: QRCodeDto,
    @Res() res,
  ) {
    const { qrType, qrFormat } = query;

    if (qrType === QRCodeType.IMAGE) {
      res.writeHead(HttpStatus.CREATED, { 'Content-Type': 'image/png' });
    }

    const buffer = await this.authService.generateTOTPMfaSecret(
      headers.authorization,
      user.email,
      qrType,
      qrFormat,
    );

    if (qrType === QRCodeType.IMAGE) {
      res.end(buffer);
      return;
    }

    return res.send(buffer);
  }

  @ApiTags('2fa')
  @ApiHeader({
    name: CommonRequestHeader.USER_DEVICE,
    description: 'User device',
  })
  @ApiOkResponse({
    description: 'Enables 2fa using TOTP.',
    type: GenericResultResponse,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Post('totp')
  async enableTotpMfa(
    @RequestHeader(UserDeviceDto) headers: UserDeviceDto,
    @Body() body: CodeDto,
  ) {
    const {
      [CommonRequestHeader.USER_DEVICE]: device,
      [CommonRequestHeader.AUTHORIZATION]: token,
    } = headers;

    return await this.authService.enableTOTPMfa(token, device, body.code);
  }

  @Public()
  @ApiTags('2fa')
  @ApiCreatedResponse({
    description: 'Verifies 2fa code.',
    type: AuthTokenResponse,
  })
  @Put('totp')
  @HttpCode(HttpStatus.CREATED)
  async verifyTotpMfaCode(@Body() body: VerifyCodeDto) {
    return await this.authService.verifyTOTPCode(
      body.user,
      body.session,
      body.code,
    );
  }

  @ApiTags('2fa')
  @ApiOkResponse({
    description: 'Disables 2fa using TOTP.',
    type: GenericResultResponse,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Delete('totp')
  async disableTotpMfa(
    @RequestHeader(AuthorizationDto) headers: AuthorizationDto,
  ) {
    return await this.authService.disableTOTPMfa(headers.authorization);
  }

  @ApiTags('2fa')
  @ApiCreatedResponse({
    description: 'Send SMS with 2fa code',
    type: DeliveryInfoResponse,
  })
  @SecuredEndpoint(HttpStatus.CREATED)
  @Get('sms')
  async getSmsMfa(@RequestHeader(AuthorizationDto) headers: AuthorizationDto) {
    const result = await this.authService.getSMSMfa(headers.authorization);
    return result;
  }

  @ApiTags('2fa')
  @ApiCreatedResponse({
    description: 'Enables 2fa using SMS.',
    type: GenericResultResponse,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Post('sms')
  async enableSmsMfa(
    @RequestHeader(AuthorizationDto) headers: AuthorizationDto,
    @Body() body: CodeDto,
  ) {
    const { [CommonRequestHeader.AUTHORIZATION]: token } = headers;

    const result = await this.authService.enableSMSMfa(token, body.code);
    return result;
  }

  @Public()
  @ApiTags('2fa')
  @ApiCreatedResponse({
    description: 'Verifies 2fa code.',
    type: AuthTokenResponse,
  })
  @Put('sms')
  @HttpCode(HttpStatus.CREATED)
  async verifySMSCode(@Body() body: VerifyCodeDto) {
    return await this.authService.verifySMSCode(
      body.user,
      body.session,
      body.code,
    );
  }

  @ApiTags('2fa')
  @ApiOkResponse({
    description: 'Disables 2fa using SMS.',
    type: GenericResultResponse,
  })
  @SecuredEndpoint(HttpStatus.OK)
  @Delete('sms')
  async disableSMSMfa(
    @RequestHeader(AuthorizationDto) headers: AuthorizationDto,
  ) {
    return await this.authService.disableSMSMfa(headers.authorization);
  }
}
