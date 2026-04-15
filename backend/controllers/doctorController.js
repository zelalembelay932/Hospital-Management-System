const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { sendNotification } = require('../utils/notificationHelper');

// Get all doctors (for patients to choose from)
exports.getAllDoctors = async (req, res) => {
    try {
        const { specialization, search } = req.query;
        
        let query = { role: 'doctor', isActive: true };
        
        // Filter by specialization
        if (specialization) {
            query.specialization = new RegExp(specialization, 'i');
        }
        
        // Search by name or specialization
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { specialization: new RegExp(search, 'i') },
                { qualification: new RegExp(search, 'i') }
            ];
        }
        
        const doctors = await User.find(query)
            .select('name specialization qualification experience consultationFee rating profileImage bio')
            .sort({ 'rating.average': -1 });
        
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

// Get single doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await User.findOne({
            _id: req.params.id,
            role: 'doctor',
            isActive: true
        }).select('-password -availabilitySlots');
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        // Get doctor's available slots for next 7 days
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const availableSlots = doctor.availabilitySlots.filter(slot => 
            slot.date >= today && 
            slot.date <= nextWeek && 
            !slot.isBooked
        );
        
        res.status(200).json({
            success: true,
            data: {
                ...doctor.toObject(),
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

// Doctor dashboard statistics
exports.getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.user.id;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Get today's appointments
        const todaysAppointments = await Appointment.find({
            doctorId,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        }).populate('patientId', 'name phone email');
        
        // Get upcoming appointments (next 7 days)
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const upcomingAppointments = await Appointment.find({
            doctorId,
            date: {
                $gte: today,
                $lt: nextWeek
            },
            status: { $in: ['pending', 'approved'] }
        })
        .populate('patientId', 'name phone email')
        .sort({ date: 1, time: 1 });
        
        // Get appointment statistics
        const totalAppointments = await Appointment.countDocuments({ doctorId });
        const pendingAppointments = await Appointment.countDocuments({ 
            doctorId, 
            status: 'pending' 
        });
        const approvedAppointments = await Appointment.countDocuments({ 
            doctorId, 
            status: 'approved' 
        });
        
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

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
    try {
        const { status, date } = req.query;
        const doctorId = req.user.id;
        
        let query = { doctorId };
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by date
        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);
            
            query.date = {
                $gte: searchDate,
                $lt: nextDay
            };
        }
        
        const appointments = await Appointment.find(query)
            .populate('patientId', 'name phone email gender dateOfBirth')
            .sort({ date: -1, time: -1 });
        
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

// Update appointment status (approve/cancel)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, reason } = req.body;
        
        // Validate status
        if (!['approved', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        // Find appointment
        const appointment = await Appointment.findById(appointmentId)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name');
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        // Check if doctor is authorized
        if (appointment.doctorId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this appointment'
            });
        }
        
        // Update appointment status
        appointment.status = status;
        if (reason) appointment.notes = reason;
        await appointment.save();
        
        // Update doctor's availability slot
        if (status === 'cancelled') {
            await User.updateOne(
                { 
                    _id: appointment.doctorId,
                    'availabilitySlots.appointmentId': appointmentId
                },
                {
                    $set: { 'availabilitySlots.$.isBooked': false }
                }
            );
        }
        
        // Create notification for patient
        await Notification.create({
            userId: appointment.patientId._id,
            title: `Appointment ${status}`,
            message: `Your appointment with Dr. ${appointment.doctorId.name} has been ${status}`,
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

// Add availability slots
exports.addAvailabilitySlots = async (req, res) => {
    try {
        const { slots } = req.body; // Array of { date, startTime, endTime }
        
        if (!slots || !Array.isArray(slots)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid slots data'
            });
        }
        
        const doctor = await User.findById(req.user.id);
        
        // Add each slot
        for (const slot of slots) {
            doctor.availabilitySlots.push({
                date: new Date(slot.date),
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBooked: false
            });
        }
        
        await doctor.save();
        
        res.status(200).json({
            success: true,
            message: 'Availability slots added successfully',
            addedSlots: slots.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get doctor's availability slots
exports.getAvailabilitySlots = async (req, res) => {
    try {
        const doctor = await User.findById(req.user.id);
        
        const { date } = req.query;
        let availabilitySlots = doctor.availabilitySlots;
        
        // Filter by date if provided
        if (date) {
            const filterDate = new Date(date);
            availabilitySlots = availabilitySlots.filter(slot => 
                slot.date.toDateString() === filterDate.toDateString()
            );
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

// Update doctor profile
exports.updateDoctorProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        // Remove fields that shouldn't be updated
        delete updates.email;
        delete updates.role;
        delete updates.password;
        
        const doctor = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password -availabilitySlots');
        
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