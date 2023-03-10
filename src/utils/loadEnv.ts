import { cleanEnv, str } from "envalid";

import { config } from "dotenv";

config();

export const ENV = cleanEnv(process.env, {
  MONGO_URI: str(),
  COOKIE_SECRET: str(),
  ACCESS_TOKEN_PRIVATE_KEY_BASE64: str(),
  ACCESS_TOKEN_PUBLIC_KEY_BASE64: str(),
  ACCESS_TOKEN_SECRET: str(),
  REFRESH_TOKEN_PRIVATE_KEY_BASE64: str(),
  REFRESH_TOKEN_PUBLIC_KEY_BASE64: str(),
  REFRESH_TOKEN_SECRET: str(),
  SENDER_IDENTITY: str(),
  SENDGRID_API_KEY: str(),
  REDIS_HOST: str(),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  LOGTAIL_SOURCE_TOKEN: str(),
});
