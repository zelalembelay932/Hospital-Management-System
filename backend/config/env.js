require('dotenv').config();

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
];

const validateEnv = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing);
        process.exit(1);
    }
};

module.exports = { validateEnv };