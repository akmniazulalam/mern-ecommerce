const REQUIRED_ENV_VARS = [
  "DB_URL",
  "SESSION_SECRET",
  "JWT_SECRET",
  "CLOUD_NAME",
  "API_KEY",
  "API_SECRET",
  "RESEND_API_KEY",
];

function getEnv(name) {
  const value = process.env[name];

  if (value === undefined || value === null || String(value).trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((name) => {
    const value = process.env[name];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

module.exports = {
  getEnv,
  validateEnv,
};
