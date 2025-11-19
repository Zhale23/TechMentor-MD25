import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

// Import entities
import { User } from './entities/user.entity';
import { Mentorship } from './entities/mentorship.entity';
import { Reservation } from './entities/reservation.entity';

const isProd = process.env.NODE_ENV === 'production';

// Optional SSL support (Aiven often requires SSL). Configure using env vars:
// - DB_SSL=true
// - DB_SSL_CA_PATH=/full/path/to/aiven-ca.pem   (preferred)
// or
// - DB_SSL_CA_BASE64=<base64-encoded-ca-cert>
let sslConfig: any = undefined;
if (process.env.DB_SSL === 'true') {
  try {
    if (process.env.DB_SSL_CA_PATH) {
      const ca = fs.readFileSync(process.env.DB_SSL_CA_PATH).toString();
      sslConfig = { ca };
    } else if (process.env.DB_SSL_CA_BASE64) {
      const ca = Buffer.from(process.env.DB_SSL_CA_BASE64, 'base64').toString();
      sslConfig = { ca };
    } else {
      // If no CA provided, allow TLS but do not set CA (may work with some providers)
      sslConfig = { rejectUnauthorized: true };
    }
  } catch (err) {
    // If reading CA fails, log to console during startup (the CLI/runner will surface errors too)
    // eslint-disable-next-line no-console
    console.error('Failed to read DB SSL CA:', err.message || err);
  }
}

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_NAME ?? 'techmentor',
  synchronize: false,
  logging: false,
  entities: [User, Mentorship, Reservation],
  migrations: [isProd ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  // Pass ssl config when required (mysql2 driver accepts `ssl` option)
  ...(sslConfig ? { ssl: sslConfig } : {}),
});

export default AppDataSource;
