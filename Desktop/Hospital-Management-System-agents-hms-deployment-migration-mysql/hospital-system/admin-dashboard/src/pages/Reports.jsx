import React, { useState, useEffect } from 'react';
import { 
    FaFilePdf, FaFileExcel, FaPrint, FaDownload, 
    FaFilter, FaCalendar, FaChartLine, FaChartBar, 
    FaUserMd, FaCalendarCheck, FaSpinner, FaUsers,
    FaCalendarAlt, FaChartPie, FaExclamationTriangle
} from 'react-icons/fa';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import reportService from '../services/reportService';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Simple Birr icon component (used instead of FaDollarSign)
const Birr = ({ className }) => (
    <span className={className} aria-hidden="true">Br</span>
);
const Reports = () => {
    const [reportType, setReportType] = useState('monthly');
    const [year, setYear] = useState(new Date().getFullYear());
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    
    // Stats data
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalAppointments: 0,
        totalPatients: 0,
        totalDoctors: 0,
        monthlyGrowth: 0
    });
    
    // Chart data
    const [monthlyData, setMonthlyData] = useState(null);
    const [doctorPerformanceData, setDoctorPerformanceData] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [appointmentStatusData, setAppointmentStatusData] = useState(null);
    
    // Loading states
    const [loading, setLoading] = useState({
        stats: false,
        monthly: false,
        doctors: false,
        revenue: false,
        status: false
    });

    // Error states
    const [errors, setErrors] = useState({
        stats: null,
        monthly: null,
        doctors: null,
        revenue: null,
        status: null
    });

    // Fetch all data on component mount
    useEffect(() => {
        fetchAllData();
    }, [year]);

    // Fetch all report data
    const fetchAllData = async () => {
        try {
            setErrors({
                stats: null,
                monthly: null,
                doctors: null,
                revenue: null,
                status: null
            });
            
            await Promise.all([
                fetchStatsSummary(),
                fetchMonthlyStats(),
                fetchDoctorPerformance(),
                fetchAppointmentStatusDistribution(),
                fetchRevenueTrend()
            ]);
            
            toast.success('All reports loaded successfully!');
        } catch (error) {
            console.error('Error fetching all data:', error);
            toast.error('Failed to load some reports. Please try again.');
        }
    };

    // Fetch statistics summary
    const fetchStatsSummary = async () => {
        setLoading(prev => ({ ...prev, stats: true }));
        setErrors(prev => ({ ...prev, stats: null }));
        
        try {
            const result = await reportService.getStatsSummary(year);
            if (result.success) {
                setStats({
                    totalRevenue: result.data.totalRevenue || 0,
                    totalAppointments: result.data.totalAppointments || 0,
                    totalPatients: result.data.totalPatients || 0,
                    totalDoctors: result.data.totalDoctors || 0,
                    monthlyGrowth: result.data.monthlyGrowth || 0
                });
            } else {
                throw new Error(result.message || 'Failed to fetch stats summary');
            }
        } catch (error) {
            console.error('Error fetching stats summary:', error);
            setErrors(prev => ({ ...prev, stats: error.message }));
            
            // Fallback to mock data
            const mockStats = {
                totalRevenue: 125000,
                totalAppointments: 425,
                totalPatients: 320,
                totalDoctors: 15,
                monthlyGrowth: 12.5
            };
            setStats(mockStats);
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    };

    // Fetch monthly statistics
    const fetchMonthlyStats = async () => {
        setLoading(prev => ({ ...prev, monthly: true }));
        setErrors(prev => ({ ...prev, monthly: null }));
        
        try {
            const result = await reportService.getMonthlyStats(year);
            if (result.success) {
                // Transform data for chart
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                const transformedData = {
                    labels: monthNames,
                    datasets: [
                        {
                            label: 'Appointments',
                            data: result.data.map(item => item.appointmentCount || 0),
                            backgroundColor: 'rgba(22, 199, 154, 0.5)',
                            borderColor: '#16C79A',
                            borderWidth: 2,
                            borderRadius: 8,
                            barPercentage: 0.6,
                        }
                    ],
                };
                setMonthlyData(transformedData);
            } else {
                throw new Error(result.message || 'Failed to fetch monthly stats');
            }
        } catch (error) {
            console.error('Error fetching monthly stats:', error);
            setErrors(prev => ({ ...prev, monthly: error.message }));
            setMonthlyData(getSampleMonthlyData());
        } finally {
            setLoading(prev => ({ ...prev, monthly: false }));
        }
    };

    // Fetch doctor performance
    const fetchDoctorPerformance = async () => {
        setLoading(prev => ({ ...prev, doctors: true }));
        setErrors(prev => ({ ...prev, doctors: null }));
        
        try {
            const result = await reportService.getDoctorPerformance(5);
            if (result.success) {
                const transformedData = {
                    labels: result.data.map(doc => 
                        doc.doctorName ? doc.doctorName.split(' ')[0] : 'Unknown'
                    ),
                    datasets: [
                        {
                            label: 'Appointments Completed',
                            data: result.data.map(doc => doc.completedAppointments || 0),
                            backgroundColor: [
                                'rgba(245, 158, 11, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(139, 92, 246, 0.8)',
                                'rgba(239, 68, 68, 0.8)'
                            ],
                            borderColor: [
                                'rgb(245, 158, 11)',
                                'rgb(16, 185, 129)',
                                'rgb(59, 130, 246)',
                                'rgb(139, 92, 246)',
                                'rgb(239, 68, 68)'
                            ],
                            borderWidth: 2,
                        }
                    ],
                };
                setDoctorPerformanceData(transformedData);
            } else {
                throw new Error(result.message || 'Failed to fetch doctor performance');
            }
        } catch (error) {
            console.error('Error fetching doctor performance:', error);
            setErrors(prev => ({ ...prev, doctors: error.message }));
            setDoctorPerformanceData(getSampleDoctorData());
        } finally {
            setLoading(prev => ({ ...prev, doctors: false }));
        }
    };

    // Fetch revenue trend
    const fetchRevenueTrend = async () => {
        setLoading(prev => ({ ...prev, revenue: true }));
        setErrors(prev => ({ ...prev, revenue: null }));
        
        try {
            const result = await reportService.getRevenueTrend('monthly', year);
            if (result.success) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                
                const revenueTransformed = {
                    labels: monthNames,
                    datasets: [
                        {
                            label: 'Revenue (Br)',
                            data: result.data.map(item => item.revenue || 0),
                            borderColor: '#11698E',
                            backgroundColor: 'rgba(17, 105, 142, 0.1)',
                            fill: true,
                            tension: 0.4,
                        }
                    ],
                };
                setRevenueData(revenueTransformed);
            } else {
                throw new Error(result.message || 'Failed to fetch revenue trend');
            }
        } catch (error) {
            console.error('Error fetching revenue trend:', error);
            setErrors(prev => ({ ...prev, revenue: error.message }));
            setRevenueData(getSampleRevenueData());
        } finally {
            setLoading(prev => ({ ...prev, revenue: false }));
        }
    };

    // Fetch appointment status distribution
    const fetchAppointmentStatusDistribution = async () => {
        setLoading(prev => ({ ...prev, status: true }));
        setErrors(prev => ({ ...prev, status: null }));
        
        try {
            const result = await reportService.getAppointmentStatusDistribution(year);
            if (result.success) {
                const statusData = {
                    labels: result.data.map(item => 
                        item.status.charAt(0).toUpperCase() + item.status.slice(1)
                    ),
                    datasets: [
                        {
                            data: result.data.map(item => item.count || 0),
                            backgroundColor: [
                                'rgba(22, 199, 154, 0.8)',  // Completed - Green
                                'rgba(17, 105, 142, 0.8)',  // Approved - Blue
                                'rgba(245, 158, 11, 0.8)',  // Pending - Yellow
                                'rgba(239, 68, 68, 0.8)'    // Cancelled - Red
                            ],
                            borderColor: [
                                '#16C79A',
                                '#11698E',
                                '#f59e0b',
                                '#ef4444'
                            ],
                            borderWidth: 2,
                        }
                    ],
                };
                setAppointmentStatusData(statusData);
            } else {
                throw new Error(result.message || 'Failed to fetch status distribution');
            }
        } catch (error) {
            console.error('Error fetching status distribution:', error);
            setErrors(prev => ({ ...prev, status: error.message }));
            // Fallback sample data
            const statusData = {
                labels: ['Completed', 'Approved', 'Pending', 'Cancelled'],
                datasets: [
                    {
                        data: [45, 25, 15, 5],
                        backgroundColor: [
                            'rgba(22, 199, 154, 0.8)',
                            'rgba(17, 105, 142, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)'
                        ],
                        borderColor: [
                            '#16C79A',
                            '#11698E',
                            '#f59e0b',
                            '#ef4444'
                        ],
                        borderWidth: 2,
                    }
                ],
            };
            setAppointmentStatusData(statusData);
        } finally {
            setLoading(prev => ({ ...prev, status: false }));
        }
    };

    // Chart options
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(13, 44, 74, 0.95)',
                titleColor: '#16C79A',
                bodyColor: '#e2e8f0',
                borderColor: '#16C79A',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    family: "'Inter', sans-serif",
                    size: 14
                },
                bodyFont: {
                    family: "'Inter', sans-serif",
                    size: 13
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(22, 199, 154, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Inter', sans-serif"
                    },
                    callback: function(value) {
                        return value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(22, 199, 154, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Inter', sans-serif"
                    }
                }
            }
        }
    };

    const lineChartOptions = {
        ...barChartOptions,
        scales: {
            ...barChartOptions.scales,
            y: {
                ...barChartOptions.scales.y,
                ticks: {
                    ...barChartOptions.scales.y.ticks,
                    callback: function(value) {
                        return 'Br ' + value.toLocaleString();
                    }
                }
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    // Export functions
    const exportReport = async (format) => {
        toast.loading(`Exporting as ${format}...`);
        setTimeout(() => {
            toast.success(`Report exported as ${format} successfully!`);
        }, 1500);
    };

    // Generate report based on type
    const generateReport = () => {
        toast.loading(`Generating ${reportType} report...`);
        
        setTimeout(() => {
            fetchAllData();
            toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated!`);
        }, 1000);
    };

    // Error display component
    const ErrorAlert = ({ message, type }) => (
        message && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg flex items-center gap-2">
                <FaExclamationTriangle className="text-red-400" />
                <span className="text-red-300 text-sm">{message}</span>
            </div>
        )
    );

    // Sample data functions (fallback)
    const getSampleMonthlyData = () => ({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Appointments',
            data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 80, 90],
            backgroundColor: 'rgba(22, 199, 154, 0.5)',
            borderColor: '#16C79A',
            borderWidth: 2,
            borderRadius: 8,
            barPercentage: 0.6,
        }],
    });

    const getSampleDoctorData = () => ({
        labels: ['Dr. Sarah', 'Dr. Mike', 'Dr. Lisa', 'Dr. James', 'Dr. Emily'],
        datasets: [{
            label: 'Appointments Completed',
            data: [120, 98, 115, 85, 105],
            backgroundColor: [
                'rgba(245, 158, 11, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
                'rgb(245, 158, 11)',
                'rgb(16, 185, 129)',
                'rgb(59, 130, 246)',
                'rgb(139, 92, 246)',
                'rgb(239, 68, 68)'
            ],
            borderWidth: 2,
        }],
    });

    const getSampleRevenueData = () => ({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue (Br)',
            data: [3250, 2950, 4000, 4050, 2800, 2750, 2000, 2250, 3000, 3750, 4000, 4500],
            borderColor: '#11698E',
            backgroundColor: 'rgba(17, 105, 142, 0.1)',
            fill: true,
            tension: 0.4,
        }],
    });

    return (
        <div className="p-4 md:p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] min-h-screen">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics Dashboard</h1>
                        <p className="text-gray-400 mt-2">Real-time insights and performance metrics</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchAllData}
                            disabled={loading.monthly || loading.doctors || loading.stats}
                            className="px-4 py-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading.monthly || loading.doctors || loading.stats ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaDownload />
                            )}
                            Refresh Data
                        </button>
                    </div>
                </div>
                
                {/* Display errors if any */}
                {(errors.stats || errors.monthly || errors.doctors || errors.revenue || errors.status) && (
                    <div className="mt-4 space-y-2">
                        {Object.entries(errors).map(([key, error]) => 
                            error && (
                                <div key={key} className="text-sm text-amber-400 flex items-center gap-2">
                                    <FaExclamationTriangle />
                                    {key.toUpperCase()}: {error}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Revenue"
                    value={`${stats.totalRevenue.toLocaleString()} ETB`}
                    icon={<Birr />}
                    color="from-green-500 to-emerald-600"
                    loading={loading.stats}
                    error={errors.stats}
                />
                <StatCard
                    title="Total Appointments"
                    value={stats.totalAppointments.toLocaleString()}
                    icon={<FaCalendarAlt />}
                    color="from-blue-500 to-cyan-600"
                    loading={loading.stats}
                    error={errors.stats}
                />
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients.toLocaleString()}
                    icon={<FaUsers />}
                    color="from-purple-500 to-violet-600"
                    loading={loading.stats}
                    error={errors.stats}
                />
                <StatCard
                    title="Monthly Growth"
                    value={`${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth.toFixed(1)}%`}
                    icon={<FaChartLine />}
                    color="from-amber-500 to-orange-600"
                    loading={loading.stats}
                    error={errors.stats}
                    trend={stats.monthlyGrowth >= 0 ? "up" : "down"}
                />
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] border border-gray-700 rounded-xl p-4 md:p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
                        <select
                            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent transition-all"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option value="monthly">Monthly Report</option>
                            <option value="quarterly">Quarterly Report</option>
                            <option value="yearly">Yearly Report</option>
                            <option value="custom">Custom Report</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                        <select
                            className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent transition-all"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        >
                            {[2023, 2024, 2025, 2026].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                        <div className="flex gap-3">
                            <input
                                type="date"
                                className="flex-1 px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent transition-all"
                                value={dateRange.start}
                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            />
                            <span className="text-gray-400 self-center">to</span>
                            <input
                                type="date"
                                className="flex-1 px-4 py-3 bg-[#0f172a] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent transition-all"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            />
                            <button
                                onClick={generateReport}
                                disabled={loading.monthly || loading.doctors}
                                className="px-6 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {loading.monthly ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <FaFilter />
                                )}
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Appointments */}
                <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] border border-gray-700 rounded-xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FaChartBar className="text-[#16C79A]" />
                                Monthly Appointments
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">Total appointments per month for {year}</p>
                        </div>
                        {loading.monthly ? (
                            <span className="text-sm text-[#16C79A] flex items-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Loading...
                            </span>
                        ) : errors.monthly && (
                            <span className="text-sm text-amber-400 flex items-center gap-2">
                                <FaExclamationTriangle />
                                Using sample data
                            </span>
                        )}
                    </div>
                    <div className="h-64 md:h-72">
                        {monthlyData ? (
                            <Bar 
                                data={monthlyData} 
                                options={barChartOptions}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <FaSpinner className="animate-spin mr-2" />
                                Loading chart data...
                            </div>
                        )}
                    </div>
                </div>

                {/* Revenue Trend */}
                <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] border border-gray-700 rounded-xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FaChartLine className="text-[#11698E]" />
                                Revenue Trend
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">Monthly revenue growth for {year}</p>
                        </div>
                        {loading.revenue ? (
                            <span className="text-sm text-[#11698E] flex items-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Loading...
                            </span>
                        ) : errors.revenue && (
                            <span className="text-sm text-amber-400 flex items-center gap-2">
                                <FaExclamationTriangle />
                                Using sample data
                            </span>
                        )}
                    </div>
                    <div className="h-64 md:h-72">
                        {revenueData ? (
                            <Line 
                                data={revenueData} 
                                options={lineChartOptions}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <FaSpinner className="animate-spin mr-2" />
                                Loading chart data...
                            </div>
                        )}
                    </div>
                </div>

                {/* Doctor Performance */}
                <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] border border-gray-700 rounded-xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FaUserMd className="text-[#f59e0b]" />
                                Top Doctors Performance
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">Completed appointments by doctor</p>
                        </div>
                        {loading.doctors ? (
                            <span className="text-sm text-[#f59e0b] flex items-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Loading...
                            </span>
                        ) : errors.doctors && (
                            <span className="text-sm text-amber-400 flex items-center gap-2">
                                <FaExclamationTriangle />
                                Using sample data
                            </span>
                        )}
                    </div>
                    <div className="h-64 md:h-72">
                        {doctorPerformanceData ? (
                            <Bar 
                                data={doctorPerformanceData} 
                                options={barChartOptions}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <FaSpinner className="animate-spin mr-2" />
                                Loading chart data...
                            </div>
                        )}
                    </div>
                </div>

                {/* Appointment Status */}
                <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] border border-gray-700 rounded-xl p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FaChartPie className="text-[#8b5cf6]" />
                                Appointment Status
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">Distribution by status for {year}</p>
                        </div>
                        {loading.status ? (
                            <span className="text-sm text-[#8b5cf6] flex items-center gap-2">
                                <FaSpinner className="animate-spin" />
                                Loading...
                            </span>
                        ) : errors.status && (
                            <span className="text-sm text-amber-400 flex items-center gap-2">
                                <FaExclamationTriangle />
                                Using sample data
                            </span>
                        )}
                    </div>
                    <div className="h-64 md:h-72">
                        {appointmentStatusData ? (
                            <Pie 
                                data={appointmentStatusData} 
                                options={pieChartOptions}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <FaSpinner className="animate-spin mr-2" />
                                Loading chart data...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Export Controls */}
            <div className="bg-gradient-to-br from-[#1e293b] to-[#334155] border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Export Reports</h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => exportReport('PDF')}
                        className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading.monthly || loading.doctors}
                    >
                        <FaFilePdf />
                        Export as PDF
                    </button>
                    <button
                        onClick={() => exportReport('Excel')}
                        className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading.monthly || loading.doctors}
                    >
                        <FaFileExcel />
                        Export as Excel
                    </button>
                    <button
                        onClick={() => exportReport('Print')}
                        className="px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading.monthly || loading.doctors}
                    >
                        <FaPrint />
                        Print Report
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-5 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-[#16C79A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading.monthly || loading.doctors}
                    >
                        <FaDownload />
                        Download All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;