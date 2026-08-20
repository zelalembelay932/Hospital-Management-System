exports.validateEnv = () => {
  const hasEnv = (key) => Object.prototype.hasOwnProperty.call(process.env, key);

  const requiredPairs = [
    { primary: "MYSQL_DATABASE", fallback: "DB_NAME" },
    { primary: "MYSQL_USER", fallback: "DB_USER" },
    { primary: "MYSQL_PASSWORD", fallback: "DB_PASSWORD" },
    { primary: "MYSQL_HOST", fallback: "DB_HOST" }
  ];

  const missing = requiredPairs
    .filter(({ primary, fallback }) => !hasEnv(primary) && !hasEnv(fallback))
    .map(({ primary, fallback }) => `${primary} or ${fallback}`);

  const requiredSingle = ["JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
  const missingSingle = requiredSingle.filter((key) => !hasEnv(key) || process.env[key] === "");

  const allMissing = missing.concat(missingSingle);

  if (allMissing.length > 0) {
    console.error("Missing required environment variables:", allMissing);
    process.exit(1);
  }
};
