const express = require('express');
const router = express.Router();
const { Op } = require('../config/database');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

router.get('/patients', auth, role('admin'), async (req, res) => {
    try {
        const patients = await User.findAll({
            where: { role: 'patient' },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/appointments', auth, role('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const where = {};

        if (status) {
            where.status = status;
        }

        const appointments = await Appointment.findAll({
            where,
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

        const total = await Appointment.count({ where });

        res.json({
            appointments,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page, 10),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/appointments/recent', auth, role('admin'), async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
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
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.patch('/appointments/:id/status', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;
        if (status === 'approved' || status === 'completed') {
            appointment.amount = 50;
            appointment.paymentStatus = 'pending';
        }

        if (status === 'cancelled') {
            appointment.amount = 0;
        }

        await appointment.save();

        res.json({
            message: `Appointment ${status} successfully`,
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/doctors', auth, role('admin'), async (req, res) => {
    try {
        const doctors = await User.findAll({
            where: { role: 'doctor' },
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/doctors/:id', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User.findOne({
            where: { id, role: 'doctor' },
            attributes: { exclude: ['password'] }
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/doctors/:id', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, specialization, phone, availableTime, status } = req.body;
        const doctor = await User.findByPk(id);

        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        if (email && email !== doctor.email) {
            const existingDoctor = await User.findOne({
                where: {
                    email,
                    id: { [Op.ne]: id }
                }
            });
            if (existingDoctor) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        if (name) doctor.name = name;
        if (email) doctor.email = email;
        if (specialization) doctor.specialization = specialization;
        if (phone) doctor.phone = phone;
        if (availableTime) doctor.availableTime = availableTime;
        if (status !== undefined) doctor.isActive = status === 'active';

        await doctor.save();

        res.json({
            message: 'Doctor updated successfully',
            doctor: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization,
                phone: doctor.phone,
                isActive: doctor.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.patch('/doctors/:id/status', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const doctor = await User.findByPk(id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.isActive = status === 'active';
        await doctor.save();

        res.json({
            message: `Doctor ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
            doctor: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                isActive: doctor.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/doctors/:id', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User.findByPk(id);

        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const hasAppointments = await Appointment.findOne({ where: { doctorId: id } });
        if (hasAppointments) {
            return res.status(400).json({ message: 'Cannot delete doctor with existing appointments' });
        }

        await doctor.destroy();
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/doctors', auth, role('admin'), async (req, res) => {
    try {
        const { name, email, password, specialization, phone, availableTime } = req.body;
        const existingDoctor = await User.findOne({ where: { email } });

        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }

        const doctor = await User.create({
            name,
            email,
            password,
            specialization,
            phone,
            availableTime: availableTime || [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
            role: 'doctor',
            isActive: true
        });

        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: {
                id: doctor.id,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization,
                phone: doctor.phone,
                isActive: doctor.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/stats', auth, role('admin'), async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const totalPatients = await User.count({ where: { role: 'patient' } });
        const totalDoctors = await User.count({ where: { role: 'doctor' } });
        const totalAppointments = await Appointment.count();
        const todayAppointments = await Appointment.count({
            where: {
                date: { [Op.gte]: today, [Op.lt]: tomorrow }
            }
        });
        const pendingAppointments = await Appointment.count({ where: { status: 'pending' } });
        const approvedAppointments = await Appointment.count({ where: { status: 'approved' } });
        const cancelledAppointments = await Appointment.count({ where: { status: 'cancelled' } });
        const completedAppointments = await Appointment.count({ where: { status: 'completed' } });
        const todayApprovedAppointments = await Appointment.count({
            where: {
                date: { [Op.gte]: today, [Op.lt]: tomorrow },
                status: 'approved'
            }
        });
        const todayCompletedAppointments = await Appointment.count({
            where: {
                date: { [Op.gte]: today, [Op.lt]: tomorrow },
                status: 'completed'
            }
        });
        const appointmentPrice = 50;
        const todayRevenue = (todayApprovedAppointments + todayCompletedAppointments) * appointmentPrice;
        const totalRevenue = (approvedAppointments + completedAppointments) * appointmentPrice;
        const weeklyRevenue = Math.round(totalRevenue * 0.25);
        const monthlyRevenue = Math.round(totalRevenue * 1.5);

        res.json({
            totalPatients,
            totalDoctors,
            totalAppointments,
            todayAppointments,
            pendingAppointments,
            approvedAppointments,
            cancelledAppointments,
            completedAppointments,
            todayApprovedAppointments,
            todayRevenue,
            totalRevenue,
            weeklyRevenue,
            monthlyRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/payments', auth, role('admin'), async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const payments = await Appointment.findAll({
            where: {
                status: { [Op.or]: ['approved', 'completed'] }
            },
            include: [
                { model: User, as: 'patient', attributes: ['id', 'name', 'email', 'phone'] },
                { model: User, as: 'doctor', attributes: ['id', 'name', 'specialization'] }
            ],
            order: [['date', 'DESC'], ['time', 'DESC']],
            limit: parseInt(limit, 10)
        });

        const paymentsWithAmount = payments.map((payment) => ({
            ...payment.toJSON(),
            amount: payment.amount || 50
        }));

        res.json(paymentsWithAmount);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/payments/stats', auth, role('admin'), async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const approvedAppointments = await Appointment.count({
            where: {
                status: 'approved',
                date: { [Op.gte]: today, [Op.lt]: tomorrow }
            }
        });
        const completedAppointments = await Appointment.count({
            where: {
                status: 'completed',
                date: { [Op.gte]: today, [Op.lt]: tomorrow }
            }
        });
        const appointmentPrice = 50;

        const stats = {
            todayRevenue: (approvedAppointments + completedAppointments) * appointmentPrice,
            totalApprovedRevenue: (await Appointment.count({ where: { status: 'approved' } })) * appointmentPrice,
            totalCompletedRevenue: (await Appointment.count({ where: { status: 'completed' } })) * appointmentPrice,
            pendingPayments: await Appointment.count({ where: { status: 'pending' } }),
            successfulPayments: await Appointment.count({
                where: {
                    status: { [Op.or]: ['approved', 'completed'] }
                }
            })
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;