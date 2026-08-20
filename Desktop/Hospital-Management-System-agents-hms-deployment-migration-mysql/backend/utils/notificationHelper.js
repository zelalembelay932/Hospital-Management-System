const Notification = require('../models/Notification');

exports.sendNotification = async (userId, title, message, type = 'appointment', relatedId = null) => {
    try {
        const notification = await Notification.create({
            userId,
            title,
            message,
            type,
            relatedId
        });

        // Here you can add WebSocket or email sending logic
        console.log(`Notification sent to user ${userId}: ${title}`);

        return notification;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

exports.getUserNotifications = async (userId, limit = 10) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId, isDeleted: false },
            order: [['createdAt', 'DESC']],
            limit
        });

        return notifications;
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
};

exports.markAsRead = async (notificationId, userId) => {
    try {
        const notification = await Notification.findOne({
            where: { id: notificationId, userId }
        });

        if (!notification) {
            return null;
        }

        notification.isRead = true;
        await notification.save();

        return notification;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return null;
    }
};