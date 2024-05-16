import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SerializeInterceptor } from 'serialize-interceptor';
import { AppModule } from './app.module';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { ErrorReportingService } from './common/modules/reporting/error-reporting.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    preflightContinue: false,
    credentials: true,
    origin: true,
  });

  // Error reporting
  const errorReportingService = app.get(ErrorReportingService);
  errorReportingService.init();
  app.useGlobalInterceptors(new ErrorInterceptor(errorReportingService));
  app.useGlobalInterceptors(new SerializeInterceptor());

  // Config
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // Documentation
  const config = new DocumentBuilder()
    .setTitle('Monorepo Starter Documentation')
    .setDescription('Open API documentation for the Monorepo Starter API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
