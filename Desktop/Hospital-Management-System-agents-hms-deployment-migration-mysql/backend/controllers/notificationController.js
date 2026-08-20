const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const userId = req.user.id || req.user.userId;

    const where = { userId, isDeleted: false };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [ ['createdAt', 'DESC'], ['priority', 'DESC'] ],
      limit: parseInt(limit, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(limit, 10)
    });

    const total = await Notification.count({ where });
    const unreadCount = await Notification.count({
      where: {
        userId,
        isRead: false,
        isDeleted: false
      }
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit, 10)
      },
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id || req.user.userId,
        isDeleted: false
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const [updatedCount] = await Notification.update(
      {
        isRead: true,
        readAt: new Date()
      },
      {
        where: {
          userId: req.user.id || req.user.userId,
          isRead: false,
          isDeleted: false
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `${updatedCount} notifications marked as read`,
      modifiedCount: updatedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id || req.user.userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const deletedCount = await Notification.destroy({
      where: { userId: req.user.id || req.user.userId }
    });

    res.status(200).json({
      success: true,
      message: `${deletedCount} notifications cleared`,
      deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};