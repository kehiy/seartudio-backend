import path from 'path';
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, JWT_SECRET, SECRET_DOMAIN } =
  process.env;
