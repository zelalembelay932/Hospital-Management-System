const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware'); // ← Halkan ka soo qaad

// Public routes
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

// Protected doctor routes
router.use(protect); // ← User-ka verify garee
router.use(authorize('doctor')); // ← Hubi inuu doctor yahay

router.get('/dashboard/stats', doctorController.getDoctorDashboard);
router.get('/appointments/list', doctorController.getDoctorAppointments);
router.put('/appointments/:appointmentId/status', doctorController.updateAppointmentStatus);
router.post('/availability/slots', doctorController.addAvailabilitySlots);
router.get('/availability/slots', doctorController.getAvailabilitySlots);
router.put('/profile/update', doctorController.updateDoctorProfile);

module.exports = router