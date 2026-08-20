// routes/reports.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes protected for admin users only
router.get('/monthly', protect, authorize('admin'), reportController.getMonthlyStats);
router.get('/doctor-performance', protect, authorize('admin'), reportController.getDoctorPerformance);
router.get('/revenue-trend', protect, authorize('admin'), reportController.getRevenueTrend);
router.get('/stats-summary', protect, authorize('admin'), reportController.getStatsSummary);
router.get('/status-distribution', protect, authorize('admin'), reportController.getAppointmentStatusDistribution);

module.exports = router;