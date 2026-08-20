const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    getTodayAppointments,        // Add this
    getUpcomingAppointments     // Add this
} = require('../controllers/appointmentController');

// Patient routes
router.post('/', protect, authorize('patient'), createAppointment);
router.get('/patient', protect, authorize('patient'), getPatientAppointments);

// Doctor routes
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/doctor/today', protect, authorize('doctor'), getTodayAppointments);        // Add this
router.get('/doctor/upcoming', protect, authorize('doctor'), getUpcomingAppointments);  // Add this
router.patch('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;