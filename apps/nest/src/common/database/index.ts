import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import { DatabaseProviders } from './constants';

export const getDatabaseConfiguration = (provider: DatabaseProviders) => [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      let caCert = '';
      const caPath = '/etc/ssl/certs/rds-combined-ca-bundle.pem';

      try {
        caCert = await fs.readFile(caPath, 'utf-8');
      } catch (err) {
        console.error('Failed to load RDS CA certificate', err);
      }

      return {
        type: provider,
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        ssl: {
          rejectUnauthorized: true,
          ca: caCert,
        },
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsTableName: 'database_migrations',
      };
    },
    inject: [ConfigService],
  }),
];
