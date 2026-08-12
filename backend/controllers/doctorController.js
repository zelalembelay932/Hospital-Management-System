const { Op, sequelize } = require('../config/database');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/notificationHelper');

exports.getAllDoctors = async (req, res) => {
    try {
        const { specialization, search } = req.query;
        const where = { role: 'doctor', isActive: true };

        if (specialization) {
            where.specialization = { [Op.like]: `%${specialization}%` };
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { specialization: { [Op.like]: `%${search}%` } },
                { qualification: { [Op.like]: `%${search}%` } }
            ];
        }

        const doctors = await User.findAll({
            where,
            attributes: ['id', 'name', 'specialization', 'qualification', 'experience', 'consultationFee', 'rating', 'profileImage', 'bio'],
            order: [[sequelize.literal("JSON_EXTRACT(rating, '$.average')"), 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findOne({
            where: {
                id: req.params.id,
                role: 'doctor',
                isActive: true
            },
            attributes: { exclude: ['password', 'availabilitySlots'] }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const slots = Array.isArray(doctor.availabilitySlots) ? doctor.availabilitySlots : [];
        const availableSlots = slots.filter((slot) => {
            const slotDate = new Date(slot.date);
            return (
                slotDate >= today &&
                slotDate <= nextWeek &&
                !slot.isBooked
            );
        });

        res.status(200).json({
            success: true,
            data: {
                ...doctor.toJSON(),
                availableSlots
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.user.id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todaysAppointments = await Appointment.findAll({
            where: {
                doctorId,
                date: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'phone', 'email']
                }
            ]
        });

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const upcomingAppointments = await Appointment.findAll({
            where: {
                doctorId,
                date: {
                    [Op.gte]: today,
                    [Op.lt]: nextWeek
                },
                status: { [Op.in]: ['pending', 'approved'] }
            },
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'phone', 'email']
                }
            ],
            order: [['date', 'ASC'], ['time', 'ASC']]
        });

        const totalAppointments = await Appointment.count({ where: { doctorId } });
        const pendingAppointments = await Appointment.count({ where: { doctorId, status: 'pending' } });
        const approvedAppointments = await Appointment.count({ where: { doctorId, status: 'approved' } });

        res.status(200).json({
            success: true,
            data: {
                dashboard: {
                    totalAppointments,
                    pendingAppointments,
                    approvedAppointments,
                    todaysAppointments: todaysAppointments.length
                },
                todaysAppointments,
                upcomingAppointments
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const { status, date } = req.query;
        const doctorId = req.user.id;

        const where = { doctorId };
        if (status) {
            where.status = status;
        }

        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);
            where.date = { [Op.gte]: searchDate, [Op.lt]: nextDay };
        }

        const appointments = await Appointment.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'phone', 'email', 'bio']
                }
            ],
            order: [['date', 'DESC'], ['time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, reason } = req.body;

        if (!['approved', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const appointment = await Appointment.findByPk(appointmentId, {
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'doctor',
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        if (appointment.doctorId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this appointment'
            });
        }

        appointment.status = status;
        if (reason) appointment.notes = reason;
        await appointment.save();

        if (status === 'cancelled') {
            const doctor = await User.findByPk(req.user.id, { attributes: ['availabilitySlots'] });
            const slots = Array.isArray(doctor.availabilitySlots) ? doctor.availabilitySlots : [];
            doctor.availabilitySlots = slots.map((slot) =>
                slot.appointmentId === appointmentId ? { ...slot, isBooked: false } : slot
            );
            await doctor.save();
        }

        await Notification.create({
            userId: appointment.patient.id,
            title: `Appointment ${status}`,
            message: `Your appointment with Dr. ${appointment.doctor.name} has been ${status}`,
            type: 'appointment',
            relatedId: appointmentId,
            relatedModel: 'Appointment'
        });

        res.status(200).json({
            success: true,
            message: `Appointment ${status} successfully`,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.addAvailabilitySlots = async (req, res) => {
    try {
        const { slots } = req.body;

        if (!slots || !Array.isArray(slots)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid slots data'
            });
        }

        const doctor = await User.findByPk(req.user.id, { attributes: ['availabilitySlots'] });
        const currentSlots = Array.isArray(doctor.availabilitySlots) ? doctor.availabilitySlots : [];

        const newSlots = slots.map((slot) => ({
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false
        }));

        doctor.availabilitySlots = [...currentSlots, ...newSlots];
        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Availability slots added successfully',
            addedSlots: newSlots.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.getAvailabilitySlots = async (req, res) => {
    try {
        const doctor = await User.findByPk(req.user.id, { attributes: ['availabilitySlots'] });
        const { date } = req.query;
        let availabilitySlots = Array.isArray(doctor.availabilitySlots) ? doctor.availabilitySlots : [];

        if (date) {
            const filterDate = new Date(date);
            availabilitySlots = availabilitySlots.filter((slot) => {
                const slotDate = new Date(slot.date);
                return slotDate.toDateString() === filterDate.toDateString();
            });
        }

        res.status(200).json({
            success: true,
            count: availabilitySlots.length,
            data: availabilitySlots
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.updateDoctorProfile = async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.email;
        delete updates.role;
        delete updates.password;

        await User.update(updates, { where: { id: req.user.id } });
        const doctor = await User.findByPk(req.user.id, { attributes: { exclude: ['password', 'availabilitySlots'] } });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};