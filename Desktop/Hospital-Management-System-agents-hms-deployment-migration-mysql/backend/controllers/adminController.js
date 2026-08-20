const { Op } = require('../config/database');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const createDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, availableTime, phone } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const doctor = await User.create({
            name,
            email,
            password,
            specialization,
            availableTime,
            phone,
            role: 'doctor',
            isActive: true
        });

        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const stats = {
            totalPatients: await User.count({ where: { role: 'patient' } }),
            totalDoctors: await User.count({ where: { role: 'doctor' } }),
            totalAppointments: await Appointment.count(),
            todayAppointments: await Appointment.count({
                where: {
                    date: {
                        [Op.gte]: today,
                        [Op.lt]: tomorrow
                    }
                }
            }),
            pendingAppointments: await Appointment.count({ where: { status: 'pending' } }),
            approvedAppointments: await Appointment.count({ where: { status: 'approved' } })
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const query = {};

        if (status) query.status = status;

        const appointments = await Appointment.findAll({
            where: query,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name', 'specialization']
                }
            ],
            order: [['date', 'DESC'], ['time', 'DESC']],
            limit: parseInt(limit, 10),
            offset: (parseInt(page, 10) - 1) * parseInt(limit, 10)
        });

        const total = await Appointment.count({ where: query });

        res.json({
            appointments,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page, 10),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateSystemSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        res.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createDoctor,
    getDashboardStats,
    getAllAppointments,
    updateSystemSettings
};