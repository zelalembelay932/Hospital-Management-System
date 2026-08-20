const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Notification extends Model {}

Notification.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('appointment', 'system', 'reminder'),
            allowNull: false,
            defaultValue: 'appointment'
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        relatedId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        relatedModel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        readAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Notification'
    }
);

module.exports = Notification;