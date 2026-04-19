function validateEnv() {
  const requiredEnv = [
    "MONGODB_URI",
    "JWT_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
  ];

  const missing = requiredEnv.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    process.exit(1);
  }

  console.log("Environment variables validated");
}

module.exports = { validateEnv };
