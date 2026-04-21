exports.validateEnv = () => {
  const requiredEnv = [
    "MONGODB_URI",
    "JWT_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
  ];

  const missing = requiredEnv.filter(env => !process.env[env]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing);
    process.exit(1);
  }
};
