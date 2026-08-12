const { Sequelize, Op } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: true,
            underscored: false
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('MySQL connected successfully');

        // Create first admin if not exists
        await createFirstAdmin();
    } catch (error) {
        console.error('MySQL connection error:', error);
        process.exit(1);
    }
};

const createFirstAdmin = async () => {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        console.log('Admin credentials not set in .env');
        return;
    }

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
        const admin = await User.create({
            name: 'System Administrator',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isActive: true
        });

        console.log('First admin created successfully');
        process.env.ADMIN_ID = admin.id.toString();
    } else {
        process.env.ADMIN_ID = existingAdmin.id.toString();
        console.log('Admin already exists, using existing admin ID');
    }
};

module.exports = { sequelize, Op, connectDB };