const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly } = req.query;
        const userId = req.user.id || req.user.userId;

        const where = { userId };
        if (unreadOnly === 'true') {
            where.isRead = false;
        }

        const notifications = await Notification.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10)
        });

        const total = await Notification.count({ where });
        const unreadCount = await Notification.count({
            where: { userId, isRead: false }
        });

        res.json({
            notifications,
            total,
            unreadCount,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page, 10)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id || req.user.userId
            }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/read-all', auth, async (req, res) => {
    try {
        const [updatedCount] = await Notification.update(
            {
                isRead: true,
                readAt: new Date()
            },
            {
                where: {
                    userId: req.user.id || req.user.userId,
                    isRead: false
                }
            }
        );

        res.json({
            message: `${updatedCount} notifications marked as read`,
            modifiedCount: updatedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id || req.user.userId
            }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.destroy();

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/clear-all', auth, async (req, res) => {
    try {
        const deletedCount = await Notification.destroy({
            where: { userId: req.user.id || req.user.userId }
        });

        res.json({
            message: `${deletedCount} notifications cleared`,
            deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/unread-count', auth, async (req, res) => {
    try {
        const count = await Notification.count({
            where: {
                userId: req.user.id || req.user.userId,
                isRead: false
            }
        });

        res.json({ unreadCount: count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;