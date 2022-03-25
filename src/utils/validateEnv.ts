import { cleanEnv, str } from 'envalid';
import { config } from 'dotenv';

config();

export const ENV = cleanEnv(process.env, {
    DB_URL: str(),
    COOKIE_SECRET: str(),
    ACCESS_TOKEN_PRIVATE_KEY_BASE64: str(),
    ACCESS_TOKEN_PUBLIC_KEY_BASE64: str(),
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_PRIVATE_KEY_BASE64: str(),
    REFRESH_TOKEN_PUBLIC_KEY_BASE64: str(),
    REFRESH_TOKEN_SECRET: str(),
    SENDER_IDENTITY: str(),
    SENDGRID_API_KEY: str(),
});