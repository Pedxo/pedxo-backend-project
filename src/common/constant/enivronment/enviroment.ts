import * as dotenv from 'dotenv';
dotenv.config();
export const ENVIRONMENT = {
  GOOGLE: {
    SMTP_USER: process.env.SMTP_USER,
    AUTH_PASS: process.env.AUTH_PASS,
  },

  CLOUDINARY: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  },

  CONN_PORT: {
    PORT: process.env.PORT,
    SESSION_SECRET: process.env.SESSION_SECRET,
  },

  OWNER: {
    OWNER_EMAIL: process.env.OWNER_EMAIL,
  },

  JWT: {
    JWT_SECRET: process.env.JWT_SECRET,
    EXPIRATION_TIME: process.env.EXPIRATION_TIME,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXP_TIME: process.env.JWT_REFRESH_EXP_TIME,
  },
};
