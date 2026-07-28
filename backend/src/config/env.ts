import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
  seedAdminName: string;
  seedAdminEmail: string;
  seedAdminPassword: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  port: Number(getEnvVar('PORT', '5050')),
  mongoUri: getEnvVar('MONGO_URI', 'mongodb://127.0.0.1:27017/bug-tracker'),
  jwtSecret: getEnvVar('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '1d'),
  corsOrigin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
  seedAdminName: getEnvVar('SEED_ADMIN_NAME', 'Admin'),
  seedAdminEmail: getEnvVar('SEED_ADMIN_EMAIL', 'admin@test.com'),
  seedAdminPassword: getEnvVar('SEED_ADMIN_PASSWORD', 'Admin@123'),
};
