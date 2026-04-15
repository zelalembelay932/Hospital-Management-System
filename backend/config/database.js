const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
        
        // Create first admin if not exists
        await createFirstAdmin();
    } catch (error) {
        console.error('MongoDB connection error:', error);
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
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = new User({
            name: 'System Administrator',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });
        
        await admin.save();
        console.log('First admin created successfully');
        
        // Store admin ID in environment for notifications
        process.env.ADMIN_ID = admin._id.toString();
    } else {
        // Update the admin ID if already exists
        process.env.ADMIN_ID = existingAdmin._id.toString();
        console.log('Admin already exists, using existing admin ID');
    }
};

module.exports = connectDB;