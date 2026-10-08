require('dotenv').config();

const requiredEnvs = [
  'PORT', 'FRONTEND_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET', 'JWT_EXPIRES_IN'
];

for (const env of requiredEnvs) {
  if (process.env[env] === undefined || process.env[env] === '') {
    console.error("Missing required environment variable: " + env);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};
