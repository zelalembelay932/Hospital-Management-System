const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

// Get all notifications for user
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly } = req.query;
        const userId = req.user.userId;
        
        let query = { userId };
        
        if (unreadOnly === 'true') {
            query.isRead = false;
        }
        
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ 
            userId, 
            isRead: false 
        });
        
        res.json({
            notifications,
            total,
            unreadCount,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { 
                _id: req.params.id,
                userId: req.user.userId
            },
            { 
                isRead: true,
                readAt: new Date()
            },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json({ 
            message: 'Notification marked as read',
            notification 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark all notifications as read
router.put('/read-all', auth, async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { 
                userId: req.user.userId,
                isRead: false
            },
            { 
                isRead: true,
                readAt: new Date()
            }
        );
        
        res.json({
            message: `${result.modifiedCount} notifications marked as read`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Clear all notifications
router.delete('/clear-all', auth, async (req, res) => {
    try {
        const result = await Notification.deleteMany({
            userId: req.user.userId
        });
        
        res.json({
            message: `${result.deletedCount} notifications cleared`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            userId: req.user.userId,
            isRead: false
        });
        
        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;