import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_NAME: process.env.DB_NAME || 'verdia',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT || '',
  GOOGLE_CLOUD_LOCATION: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  GOOGLE_CLOUD_RAG_CORPUS: process.env.GOOGLE_CLOUD_RAG_CORPUS || '',
  GOOGLE_CLOUD_DRIVE_FOLDER_ID: process.env.GOOGLE_CLOUD_DRIVE_FOLDER_ID || '',
  GOOGLE_CLOUD_GEMINI_MODEL: process.env.GOOGLE_CLOUD_GEMINI_MODEL || 'gemini-3.5-flash',
};
