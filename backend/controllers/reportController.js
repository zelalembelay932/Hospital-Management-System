// reportController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Get monthly statistics
exports.getMonthlyStats = async (req, res) => {
    try {
        const { year } = req.query;
        const matchYear = year ? parseInt(year) : new Date().getFullYear();
        
        // Create date range for the year
        const startDate = new Date(matchYear, 0, 1); // January 1
        const endDate = new Date(matchYear + 1, 0, 1); // January 1 next year

        const monthlyStats = await Appointment.aggregate([
            {
                // Filter by date range and relevant statuses
                $match: {
                    $and: [
                        { date: { $gte: startDate, $lt: endDate } },
                        { status: { $in: ['approved', 'completed'] } }
                    ]
                }
            },
            {
                // Group by month
                $group: {
                    _id: { $month: "$date" },
                    appointmentCount: { $sum: 1 },
                    totalRevenue: { $sum: "$amount" }
                }
            },
            {
                // Sort by month
                $sort: { "_id": 1 }
            },
            {
                // Format output
                $project: {
                    _id: 0,
                    month: "$_id",
                    appointmentCount: 1,
                    totalRevenue: 1
                }
            }
        ]);

        // Create array for all 12 months
        const allMonths = Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyStats.find(stat => stat.month === i + 1);
            return {
                month: i + 1,
                appointmentCount: monthData ? monthData.appointmentCount : 0,
                totalRevenue: monthData ? monthData.totalRevenue : 0
            };
        });

        res.status(200).json({
            success: true,
            year: matchYear,
            data: allMonths
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching monthly stats', 
            error: error.message 
        });
    }
};

// Get doctor performance statistics
exports.getDoctorPerformance = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const doctorPerformance = await Appointment.aggregate([
            {
                $match: { 
                    status: 'completed',
                    doctorId: { $exists: true, $ne: null }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctorDetails'
                }
            },
            {
                $unwind: {
                    path: '$doctorDetails',
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $group: {
                    _id: '$doctorId',
                    doctorName: { 
                        $first: '$doctorDetails.name'  // Use $first instead of $ifNull for better performance
                    },
                    specialization: { 
                        $first: '$doctorDetails.specialization'
                    },
                    completedAppointments: { $sum: 1 },
                    totalRevenue: { $sum: '$amount' }
                }
            },
            {
                $sort: { completedAppointments: -1 }
            },
            {
                $limit: parseInt(limit)
            },
            {
                $project: {
                    _id: 0,
                    doctorId: '$_id',
                    doctorName: 1,
                    specialization: 1,
                    completedAppointments: 1,
                    totalRevenue: 1
                }
            }
        ]);

        // If no data found, return empty array
        if (!doctorPerformance || doctorPerformance.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No doctor performance data available'
            });
        }

        res.status(200).json({
            success: true,
            data: doctorPerformance
        });

    } catch (error) {
        console.error('Error in getDoctorPerformance:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching doctor performance', 
            error: error.message 
        });
    }
};

// Get revenue trend
exports.getRevenueTrend = async (req, res) => {
    try {
        const { year, period = 'monthly' } = req.query;
        const matchYear = year ? parseInt(year) : new Date().getFullYear();
        
        // Create date range
        const startDate = new Date(matchYear, 0, 1);
        const endDate = new Date(matchYear + 1, 0, 1);
        
        let groupByStage;
        let projectStage;
        
        if (period === 'weekly') {
            // Weekly grouping
            groupByStage = {
                $group: {
                    _id: { $week: "$date" },
                    revenue: { $sum: "$amount" }
                }
            };
            projectStage = {
                $project: {
                    _id: 0,
                    week: "$_id",
                    revenue: 1
                }
            };
        } else {
            // Monthly grouping (default)
            groupByStage = {
                $group: {
                    _id: { $month: "$date" },
                    revenue: { $sum: "$amount" }
                }
            };
            projectStage = {
                $project: {
                    _id: 0,
                    month: "$_id",
                    revenue: 1
                }
            };
        }

        const revenueData = await Appointment.aggregate([
            {
                $match: {
                    $and: [
                        { date: { $gte: startDate, $lt: endDate } },
                        { status: { $in: ['approved', 'completed'] } },
                        { amount: { $gt: 0 } }
                    ]
                }
            },
            groupByStage,
            {
                $sort: { "_id": 1 }
            },
            projectStage
        ]);

        // Fill missing data
        let allData;
        if (period === 'weekly') {
            allData = Array.from({ length: 52 }, (_, i) => {
                const weekData = revenueData.find(stat => stat.week === i + 1);
                return {
                    week: i + 1,
                    revenue: weekData ? weekData.revenue : 0
                };
            });
        } else {
            allData = Array.from({ length: 12 }, (_, i) => {
                const monthData = revenueData.find(stat => stat.month === i + 1);
                return {
                    month: i + 1,
                    revenue: monthData ? monthData.revenue : 0
                };
            });
        }

        res.status(200).json({
            success: true,
            year: matchYear,
            period: period,
            data: allData
        });

    } catch (error) {
        console.error('Error fetching revenue trend:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching revenue trend', 
            error: error.message 
        });
    }
};

// Get statistics summary for dashboard
exports.getStatsSummary = async (req, res) => {
    try {
        const { year } = req.query;
        const matchYear = year ? parseInt(year) : new Date().getFullYear();
        
        const firstDayOfYear = new Date(matchYear, 0, 1);
        const lastDayOfYear = new Date(matchYear + 1, 0, 1);
        
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const firstDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        
        const stats = await Promise.all([
            // Total appointments for current year
            Appointment.countDocuments({
                date: { $gte: firstDayOfYear, $lt: lastDayOfYear },
                status: { $in: ['approved', 'completed'] }
            }),
            
            // Total revenue for current year
            Appointment.aggregate([
                {
                    $match: {
                        date: { $gte: firstDayOfYear, $lt: lastDayOfYear },
                        status: { $in: ['approved', 'completed'] },
                        amount: { $gt: 0 }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]),
            
            // Total patients
            User.countDocuments({ role: 'patient' }),
            
            // Total doctors
            User.countDocuments({ role: 'doctor' })
        ]);
        
        // Calculate current month revenue
        const currentMonthRevenue = await Appointment.aggregate([
            {
                $match: {
                    date: { 
                        $gte: firstDayOfMonth,
                        $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                    },
                    status: { $in: ['approved', 'completed'] },
                    amount: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        
        // Calculate previous month revenue
        const previousMonthRevenue = await Appointment.aggregate([
            {
                $match: {
                    date: { 
                        $gte: firstDayOfPrevMonth,
                        $lt: firstDayOfMonth
                    },
                    status: { $in: ['approved', 'completed'] },
                    amount: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);
        
        const currentRevenue = currentMonthRevenue[0]?.total || 0;
        const previousRevenue = previousMonthRevenue[0]?.total || 0;
        const monthlyGrowth = previousRevenue > 0 
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
            : currentRevenue > 0 ? 100 : 0;
        
        res.status(200).json({
            success: true,
            data: {
                totalAppointments: stats[0],
                totalRevenue: stats[1][0]?.total || 0,
                totalPatients: stats[2],
                totalDoctors: stats[3],
                monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1))
            }
        });
        
    } catch (error) {
        console.error('Error fetching stats summary:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching stats summary', 
            error: error.message 
        });
    }
};

// Get appointment status distribution
exports.getAppointmentStatusDistribution = async (req, res) => {
    try {
        const { year } = req.query;
        const matchYear = year ? parseInt(year) : new Date().getFullYear();
        
        const startDate = new Date(matchYear, 0, 1);
        const endDate = new Date(matchYear + 1, 0, 1);
        
        const statusDistribution = await Appointment.aggregate([
            {
                $match: {
                    date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            }
        ]);
        
        // Map to ensure all statuses are present
        const allStatuses = ['pending', 'approved', 'completed', 'cancelled'];
        const completeDistribution = allStatuses.map(status => {
            const existing = statusDistribution.find(s => s.status === status);
            return {
                status,
                count: existing ? existing.count : 0
            };
        });
        
        res.status(200).json({
            success: true,
            year: matchYear,
            data: completeDistribution
        });
        
    } catch (error) {
        console.error('Error fetching status distribution:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching appointment status distribution', 
            error: error.message 
        });
    }
};