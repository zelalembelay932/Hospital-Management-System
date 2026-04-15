const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    adminLogin, 
    doctorLogin, 
    authMiddleware, 
    requireRole, 
    getCurrentUser 
} = require('../controllers/authController');

// Public routes
router.post('/register', register); // Only for patients
router.post('/login', login); // For all roles

// Role-specific login routes
router.post('/admin/login', adminLogin);
router.post('/doctor/login', doctorLogin);

// Protected route to get current user (used by frontend to verify token)
router.get('/me', authMiddleware, getCurrentUser);

// Example of protected admin route
router.get('/admin/dashboard', authMiddleware, requireRole(['admin']), (req, res) => {
    res.json({ message: 'Welcome to admin dashboard', user: req.user });
});

// Example of protected doctor route
router.get('/doctor/dashboard', authMiddleware, requireRole(['doctor']), (req, res) => {
    res.json({ message: 'Welcome to doctor dashboard', user: req.user });
});

module.exports = router;