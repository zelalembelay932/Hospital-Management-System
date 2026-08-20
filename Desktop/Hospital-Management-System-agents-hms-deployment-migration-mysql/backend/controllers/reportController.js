const { Op, sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.getMonthlyStats = async (req, res) => {
    try {
        const { year } = req.query;
        const matchYear = year ? parseInt(year, 10) : new Date().getFullYear();
        const startDate = new Date(matchYear, 0, 1);
        const endDate = new Date(matchYear + 1, 0, 1);

        const appointmentTable = Appointment.getTableName();

        const monthlyStats = await sequelize.query(
            `SELECT MONTH(date) AS month, COUNT(*) AS appointmentCount, COALESCE(SUM(amount), 0) AS totalRevenue
             FROM ${appointmentTable}
             WHERE date >= ? AND date < ? AND status IN ('approved', 'completed')
             GROUP BY MONTH(date)
             ORDER BY MONTH(date)`,
            {
                replacements: [startDate, endDate],
                type: QueryTypes.SELECT
            }
        );

        const allMonths = Array.from({ length: 12 }, (_, i) => {
            const monthData = monthlyStats.find((stat) => stat.month === i + 1);
            return {
                month: i + 1,
                appointmentCount: monthData ? Number(monthData.appointmentCount) : 0,
                totalRevenue: monthData ? Number(monthData.totalRevenue) : 0
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

exports.getDoctorPerformance = async (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const appointmentTable = Appointment.getTableName();
        const userTable = User.getTableName();

        const doctorPerformance = await sequelize.query(
            `SELECT a.doctorId AS doctorId,
                    d.name AS doctorName,
                    d.specialization AS specialization,
                    COUNT(*) AS completedAppointments,
                    COALESCE(SUM(a.amount), 0) AS totalRevenue
             FROM ${appointmentTable} a
             LEFT JOIN ${userTable} d ON d.id = a.doctorId
             WHERE a.status = 'completed' AND a.doctorId IS NOT NULL
             GROUP BY a.doctorId, d.name, d.specialization
             ORDER BY completedAppointments DESC
             LIMIT ?`,
            {
                replacements: [parseInt(limit, 10)],
                type: QueryTypes.SELECT
            }
        );

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

exports.getRevenueTrend = async (req, res) => {
    try {
        const { year, period = 'monthly' } = req.query;
        const matchYear = year ? parseInt(year, 10) : new Date().getFullYear();
        const startDate = new Date(matchYear, 0, 1);
        const endDate = new Date(matchYear + 1, 0, 1);
        const appointmentTable = Appointment.getTableName();

        let grouping = 'MONTH(date)';
        let field = 'month';

        if (period === 'weekly') {
            grouping = 'WEEK(date, 1)';
            field = 'week';
        }

        const revenueData = await sequelize.query(
            `SELECT ${grouping} AS ${field}, COALESCE(SUM(amount), 0) AS revenue
             FROM ${appointmentTable}
             WHERE date >= ? AND date < ? AND status IN ('approved', 'completed') AND amount > 0
             GROUP BY ${grouping}
             ORDER BY ${grouping}`,
            {
                replacements: [startDate, endDate],
                type: QueryTypes.SELECT
            }
        );

        let allData;
        if (period === 'weekly') {
            allData = Array.from({ length: 52 }, (_, i) => {
                const weekData = revenueData.find((stat) => stat.week === i + 1);
                return {
                    week: i + 1,
                    revenue: weekData ? Number(weekData.revenue) : 0
                };
            });
        } else {
            allData = Array.from({ length: 12 }, (_, i) => {
                const monthData = revenueData.find((stat) => stat.month === i + 1);
                return {
                    month: i + 1,
                    revenue: monthData ? Number(monthData.revenue) : 0
                };
            });
        }

        res.status(200).json({
            success: true,
            year: matchYear,
            period,
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

exports.getStatsSummary = async (req, res) => {
    try {
        const { year } = req.query;
        const matchYear = year ? parseInt(year, 10) : new Date().getFullYear();
        const firstDayOfYear = new Date(matchYear, 0, 1);
        const lastDayOfYear = new Date(matchYear + 1, 0, 1);
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const firstDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

        const [
            totalAppointments,
            totalRevenue,
            totalPatients,
            totalDoctors
        ] = await Promise.all([
            Appointment.count({
                where: {
                    date: { [Op.gte]: firstDayOfYear, [Op.lt]: lastDayOfYear },
                    status: { [Op.in]: ['approved', 'completed'] }
                }
            }),
            Appointment.sum('amount', {
                where: {
                    date: { [Op.gte]: firstDayOfYear, [Op.lt]: lastDayOfYear },
                    status: { [Op.in]: ['approved', 'completed'] },
                    amount: { [Op.gt]: 0 }
                }
            }),
            User.count({ where: { role: 'patient' } }),
            User.count({ where: { role: 'doctor' } })
        ]);

        const currentMonthRevenue = await Appointment.sum('amount', {
            where: {
                date: { [Op.gte]: firstDayOfMonth, [Op.lt]: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) },
                status: { [Op.in]: ['approved', 'completed'] },
                amount: { [Op.gt]: 0 }
            }
        });

        const previousMonthRevenue = await Appointment.sum('amount', {
            where: {
                date: { [Op.gte]: firstDayOfPrevMonth, [Op.lt]: firstDayOfMonth },
                status: { [Op.in]: ['approved', 'completed'] },
                amount: { [Op.gt]: 0 }
            }
        });

        const currentRevenue = Number(currentMonthRevenue || 0);
        const previousRevenue = Number(previousMonthRevenue || 0);
        const monthlyGrowth = previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : currentRevenue > 0 ? 100 : 0;

        res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                totalRevenue: Number(totalRevenue || 0),
                totalPatients,
                totalDoctors,
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

exports.getAppointmentStatusDistribution = async (req, res) => {
    try {
        const { year } = req.query;
        const matchYear = year ? parseInt(year, 10) : new Date().getFullYear();
        const startDate = new Date(matchYear, 0, 1);
        const endDate = new Date(matchYear + 1, 0, 1);

        const statusDistribution = await sequelize.query(
            `SELECT status, COUNT(*) AS count
             FROM ${Appointment.getTableName()}
             WHERE date >= ? AND date < ?
             GROUP BY status`,
            {
                replacements: [startDate, endDate],
                type: QueryTypes.SELECT
            }
        );

        const allStatuses = ['pending', 'approved', 'completed', 'cancelled'];
        const completeDistribution = allStatuses.map((status) => {
            const existing = statusDistribution.find((s) => s.status === status);
            return {
                status,
                count: existing ? Number(existing.count) : 0
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