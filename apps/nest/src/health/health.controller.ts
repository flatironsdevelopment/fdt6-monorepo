import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from '../common/decorators/public.decorator';
import { AuthProviderService } from '../common/modules/auth/auth-provider.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private authProvider: AuthProviderService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => {
        const check = await this.authProvider.healthCheck();

        return {
          [this.authProvider.provider.name]: {
            status: check.success ? 'up' : 'down',
            ...check,
          },
        };
      },
    ]);
  }
}
