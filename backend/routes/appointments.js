const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
    createAppointment,
    getPatientAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    getTodayAppointments,        // Add this
    getUpcomingAppointments     // Add this
} = require('../controllers/appointmentController');

// Patient routes
router.post('/', auth, role('patient'), createAppointment);
router.get('/patient', auth, role('patient'), getPatientAppointments);

// Doctor routes
router.get('/doctor', auth, role('doctor'), getDoctorAppointments);
router.get('/doctor/today', auth, role('doctor'), getTodayAppointments);        // Add this
router.get('/doctor/upcoming', auth, role('doctor'), getUpcomingAppointments);  // Add this
router.patch('/:id/status', auth, role('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;