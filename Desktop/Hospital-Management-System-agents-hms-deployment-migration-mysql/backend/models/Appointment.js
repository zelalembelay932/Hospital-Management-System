const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class Appointment extends Model {}

Appointment.init(
    {
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        doctorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'cancelled', 'completed'),
            allowNull: false,
            defaultValue: 'pending'
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 20
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
            allowNull: false,
            defaultValue: 'pending'
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Appointment'
    }
);

module.exports = Appointment;