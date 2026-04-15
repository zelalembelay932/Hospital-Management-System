const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create appointment
const createAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, symptoms } = req.body;
        const patientId = req.user.userId;
        
        // Check if date is in the past
        const appointmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (appointmentDate < today) {
            return res.status(400).json({ message: 'Cannot book appointments in the past' });
        }
        
        // Check doctor availability
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        // Check if slot is already booked
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date: appointmentDate,
            time,
            status: { $in: ['pending', 'approved'] }
        });
        
        if (existingAppointment) {
            return res.status(400).json({ message: 'This time slot is already booked' });
        }
        
        // Create appointment
        const appointment = new Appointment({
            patientId,
            doctorId,
            date: appointmentDate,
            time,
            symptoms,
            status: 'pending'
        });
        
        await appointment.save();
        
        // Create notifications
        await Notification.create([
            {
                userId: doctorId,
                title: 'New Appointment Request',
                message: `You have a new appointment request from ${req.user.name}`,
                type: 'appointment',
                relatedId: appointment._id
            },
            {
                userId: process.env.ADMIN_ID, // First admin ID from env
                title: 'New Appointment Booked',
                message: `A new appointment has been booked`,
                type: 'appointment',
                relatedId: appointment._id
            }
        ]);
        
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get appointments for patient
const getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.userId })
            .populate('doctorId', 'name specialization')
            .sort({ date: -1 });
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get appointments for doctor
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user.userId })
            .populate('patientId', 'name email phone')
            .sort({ date: -1 });
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        // Check if doctor owns this appointment
        if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        appointment.status = status;
        await appointment.save();
        
        // Create notification for patient
        await Notification.create({
            userId: appointment.patientId,
            title: `Appointment ${status}`,
            message: `Your appointment has been ${status}`,
            type: 'appointment',
            relatedId: appointment._id
        });
        
        res.json({
            message: `Appointment ${status} successfully`,
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Get today's appointments for doctor
const getTodayAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const appointments = await Appointment.find({
            doctorId: req.user.userId,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        })
        .populate('patientId', 'name email phone')
        .sort({ time: 1 });
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get upcoming appointments for doctor (next 7 days)
const getUpcomingAppointments = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const appointments = await Appointment.find({
            doctorId: req.user.userId,
            date: {
                $gte: today,
                $lt: nextWeek
            },
            status: { $in: ['approved', 'pending'] }
        })
        .populate('patientId', 'name email phone')
        .sort({ date: 1, time: 1 });
        
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
    getTodayAppointments,        // Export these
    getUpcomingAppointments 
};