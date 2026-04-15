const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Get all patients (admin only)
router.get('/patients', auth, role('admin'), async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all appointments (admin only) with pagination
router.get('/appointments', auth, role('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        
        const query = {};
        if (status) query.status = status;
        
        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone')
            .populate('doctorId', 'name specialization')
            .sort({ date: -1, time: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await Appointment.countDocuments(query);
        
        res.json({
            appointments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get recent appointments (for dashboard)
router.get('/appointments/recent', auth, role('admin'), async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patientId', 'name email phone')
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update appointment status (admin only)
router.patch('/appointments/:id/status', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        appointment.status = status;
        
        // If status is approved, add amount field
        if (status === 'approved' || status === 'completed') {
            appointment.amount = 50; // Default appointment price
            appointment.paymentStatus = 'pending';
        }
        
        // If status is cancelled, set amount to 0
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

// Get all doctors (admin only)
router.get('/doctors', auth, role('admin'), async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single doctor by ID
router.get('/doctors/:id', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        const doctor = await User.findById(id).select('-password');
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update doctor (admin only)
router.put('/doctors/:id', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, specialization, phone, availableTime, status } = req.body;
        
        // Check if doctor exists
        const doctor = await User.findById(id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        // Check if email already exists for another doctor
        if (email && email !== doctor.email) {
            const existingDoctor = await User.findOne({ email, _id: { $ne: id } });
            if (existingDoctor) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        
        // Update doctor fields
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
                id: doctor._id,
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

// Update doctor status (activate/deactivate)
router.patch('/doctors/:id/status', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const doctor = await User.findById(id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        doctor.isActive = status === 'active';
        await doctor.save();
        
        res.json({
            message: `Doctor ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                isActive: doctor.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete doctor (admin only)
router.delete('/doctors/:id', auth, role('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        
        const doctor = await User.findById(id);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        // Check if doctor has appointments
        const hasAppointments = await Appointment.findOne({ doctorId: id });
        if (hasAppointments) {
            return res.status(400).json({ 
                message: 'Cannot delete doctor with existing appointments' 
            });
        }
        
        await User.findByIdAndDelete(id);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create doctor (admin only)
router.post('/doctors', auth, role('admin'), async (req, res) => {
    try {
        const { name, email, password, specialization, phone, availableTime } = req.body;
        
        // Check if doctor exists
        const existingDoctor = await User.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }
        
        const doctor = new User({
            name,
            email,
            password,
            specialization,
            phone,
            availableTime: availableTime || [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
            role: 'doctor',
            isActive: true
        });
        
        await doctor.save();
        
        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: {
                id: doctor._id,
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

// Get dashboard statistics (admin only) - UPDATED WITH REVENUE
router.get('/stats', auth, role('admin'), async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Calculate counts
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalAppointments = await Appointment.countDocuments();
        
        // Today's appointments
        const todayAppointments = await Appointment.countDocuments({
            date: { $gte: today, $lt: tomorrow }
        });
        
        // Count by status
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const approvedAppointments = await Appointment.countDocuments({ status: 'approved' });
        const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        
        // Today's approved appointments
        const todayApprovedAppointments = await Appointment.countDocuments({
            date: { $gte: today, $lt: tomorrow },
            status: 'approved'
        });
        
        // Today's completed appointments
        const todayCompletedAppointments = await Appointment.countDocuments({
            date: { $gte: today, $lt: tomorrow },
            status: 'completed'
        });
        
        // Revenue calculations (using $50 per appointment)
        const appointmentPrice = 50;
        const todayRevenue = (todayApprovedAppointments + todayCompletedAppointments) * appointmentPrice;
        const totalRevenue = (approvedAppointments + completedAppointments) * appointmentPrice;
        const weeklyRevenue = Math.round(totalRevenue * 0.25);
        const monthlyRevenue = Math.round(totalRevenue * 1.5);
        
        const stats = {
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
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get payments (admin only) - NEW ENDPOINT
router.get('/payments', auth, role('admin'), async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        
        const payments = await Appointment.find({
            $or: [
                { status: 'approved' },
                { status: 'completed' }
            ]
        })
        .populate('patientId', 'name email phone')
        .populate('doctorId', 'name specialization')
        .select('date time status patientId doctorId amount')
        .sort({ date: -1, time: -1 })
        .limit(parseInt(limit));
        
        // Add amount field if not present
        const paymentsWithAmount = payments.map(payment => ({
            ...payment.toObject(),
            amount: payment.amount || 50
        }));
        
        res.json(paymentsWithAmount);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get payment statistics (admin only) - NEW ENDPOINT
router.get('/payments/stats', auth, role('admin'), async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Calculate revenue from appointments
        const approvedAppointments = await Appointment.countDocuments({ 
            status: 'approved',
            date: { $gte: today, $lt: tomorrow }
        });
        
        const completedAppointments = await Appointment.countDocuments({ 
            status: 'completed',
            date: { $gte: today, $lt: tomorrow }
        });
        
        const appointmentPrice = 50; // Default price
        
        const stats = {
            todayRevenue: (approvedAppointments + completedAppointments) * appointmentPrice,
            totalApprovedRevenue: (await Appointment.countDocuments({ status: 'approved' })) * appointmentPrice,
            totalCompletedRevenue: (await Appointment.countDocuments({ status: 'completed' })) * appointmentPrice,
            pendingPayments: await Appointment.countDocuments({ status: 'pending' }),
            successfulPayments: await Appointment.countDocuments({ 
                $or: [
                    { status: 'approved' },
                    { status: 'completed' }
                ]
            })
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;