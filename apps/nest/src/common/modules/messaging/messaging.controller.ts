import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiKeyHeaderDoc } from '../../constants/open-api';
import { ApiKeyGuard } from '../../guards/api.guard';
import { AccountCreatedDto, SendEmailDto } from './dto/email.dto';
import {
  AccountCreatedCodeDto,
  ForgotPasswordCodeDto,
  SendSmsDto,
  VerificationCodeDto,
} from './dto/sms.dto';
import { MessagingService } from './messaging.service';

@Controller({
  path: 'messaging',
  version: '1',
})
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @ApiTags('messaging')
  @ApiCreatedResponse({
    description: 'Sends a sms to the target.',
  })
  @ApiExtraModels(
    AccountCreatedCodeDto,
    ForgotPasswordCodeDto,
    VerificationCodeDto,
  )
  @ApiKeyHeaderDoc()
  @Post('sms/send')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ApiKeyGuard)
  async sendSms(@Body() smsDto: SendSmsDto) {
    return this.messagingService.sendSms(smsDto);
  }

  @ApiTags('messaging')
  @ApiCreatedResponse({
    description: 'Sends an email to the target.',
  })
  @ApiExtraModels(AccountCreatedDto)
  @ApiKeyHeaderDoc()
  @Post('email/send')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(ApiKeyGuard)
  async sendEmail(@Body() emailDto: SendEmailDto) {
    return this.messagingService.sendEmail(emailDto);
  }
}
