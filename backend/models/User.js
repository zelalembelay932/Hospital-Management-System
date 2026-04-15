const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password by default in queries
    },
    role: {
        type: String,
        enum: {
            values: ['patient', 'doctor', 'admin'],
            message: 'Role must be patient, doctor, or admin'
        },
        default: 'patient'
    },
    specialization: {
        type: String,
        required: function() {
            return this.role === 'doctor';
        }
    },
    availableTime: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String
    }],
    phone: {
        type: String,
        match: [/^(\+251|0)?9\d{8}$/, "Please enter a valid phone number"]
    },
    address: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware for Mongoose 7+
userSchema.pre('save', async function() {
    // Only hash the password if it's modified (or new)
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    
    // Update the updatedAt timestamp
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `Dr. ${this.name}`;
});

// Method to get user info without password
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ specialization: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;