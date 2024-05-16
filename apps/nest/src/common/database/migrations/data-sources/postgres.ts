import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'test',
  password: process.env.DATABASE_PASSWORD || 'test',
  database: process.env.DATABASE_NAME || 'test',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../*{.ts,.js}'],
  ssl: true,
});
