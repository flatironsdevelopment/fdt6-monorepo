import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @ApiOkResponse({
    description: 'Returns "Pong!"',
    type: String,
  })
  @Get()
  ping(): string {
    return this.appService.ping();
  }
}
