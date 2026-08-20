const { Op } = require('../config/database');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getUserId = (req) => req.user?.userId || req.user?.id;

const createAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, symptoms } = req.body;
        const patientId = getUserId(req);

        const appointmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (appointmentDate < today) {
            return res.status(400).json({ message: 'Cannot book appointments in the past' });
        }

        const doctor = await User.findByPk(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId,
                date: appointmentDate,
                time,
                status: { [Op.in]: ['pending', 'approved'] }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            date: appointmentDate,
            time,
            notes: symptoms,
            status: 'pending'
        });

        const notifications = [
            {
                userId: doctorId,
                title: 'New Appointment Request',
                message: `You have a new appointment request from ${req.user?.name || 'a patient'}`,
                type: 'appointment',
                relatedId: appointment.id.toString(),
                relatedModel: 'Appointment'
            }
        ];

        if (process.env.ADMIN_ID) {
            notifications.push({
                userId: parseInt(process.env.ADMIN_ID, 10),
                title: 'New Appointment Booked',
                message: 'A new appointment has been booked',
                type: 'appointment',
                relatedId: appointment.id.toString(),
                relatedModel: 'Appointment'
            });
        }

        await Notification.bulkCreate(notifications);

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { patientId: getUserId(req) },
            include: [
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name', 'specialization']
                }
            ],
            order: [['date', 'DESC']]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { doctorId: getUserId(req) },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [['date', 'DESC']]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (req.user.role === 'doctor' && appointment.doctorId !== getUserId(req)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        await appointment.save();

        await Notification.create({
            userId: appointment.patientId,
            title: `Appointment ${status}`,
            message: `Your appointment has been ${status}`,
            type: 'appointment',
            relatedId: appointment.id.toString(),
            relatedModel: 'Appointment'
        });

        res.json({
            message: `Appointment ${status} successfully`,
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTodayAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await Appointment.findAll({
            where: {
                doctorId: getUserId(req),
                date: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [['time', 'ASC']]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUpcomingAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const appointments = await Appointment.findAll({
            where: {
                doctorId: getUserId(req),
                date: {
                    [Op.gte]: today,
                    [Op.lt]: nextWeek
                },
                status: { [Op.in]: ['approved', 'pending'] }
            },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [['date', 'ASC'], ['time', 'ASC']]
        });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    getTodayAppointments,
    getUpcomingAppointments
};