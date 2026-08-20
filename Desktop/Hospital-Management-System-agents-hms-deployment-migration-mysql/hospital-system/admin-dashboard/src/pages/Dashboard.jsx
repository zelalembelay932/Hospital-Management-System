import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaClock,
  FaUserInjured,
  FaCalendarTimes,
  FaSync,
  FaChartLine,
  FaCalendarAlt
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Simple Birr icon component (used instead of FaDollarSign)
const Birr = ({ className }) => (
  <span className={className} aria-hidden="true">Br</span>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    cancelledAppointments: 0,
    completedAppointments: 0,
    todayRevenue: 0,
    totalRevenue: 0
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data);

      const appointmentsResponse = await api.get('/admin/appointments/recent');
      setRecentAppointments(appointmentsResponse.data || []);
      
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const appointmentsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 8, 15, 22, 18, 10],
        backgroundColor: 'rgba(88, 174, 252, 0.8)',
          borderColor: '#58aefc',
        borderWidth: 2,
      }
    ],
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'approved': return <span className={`${baseClasses} bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]`}>Approved</span>;
      case 'pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'completed': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
      case 'cancelled': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#19456B] to-[#0d2c4a]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#16C79A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-xl p-8 text-center transition-all duration-300 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Error Loading Dashboard</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-3 mx-auto shadow-lg"
          >
            <FaSync /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6  min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-[#16C79A]/80">Welcome back, Administrator</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl"
        >
          <FaSync /> Refresh Dashboard
        </button>
      </div>

      {/* Stats Cards with Sidebar Matching Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div 
          className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium mb-2">Total Patients</p>
              <h3 className="text-3xl font-bold">{stats.totalPatients}</h3>
              <p className="text-sm text-gray-300 mt-2">All registered patients</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaUsers className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div 
          className="bg-gradient-to-br from-[#11698E] to-[#19456B] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium mb-2">Total Doctors</p>
              <h3 className="text-3xl font-bold">{stats.totalDoctors}</h3>
              <p className="text-sm text-gray-300 mt-2">Medical professionals</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaUserMd className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div 
          className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium mb-2">Today Appointments</p>
              <h3 className="text-3xl font-bold">{stats.todayAppointments}</h3>
              <p className="text-sm text-gray-300 mt-2">Scheduled for today</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaClock className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div 
          className="bg-gradient-to-br from-[#11698E] to-[#19456B] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium mb-2">Today Revenue</p>
              <h3 className="text-3xl font-bold">{stats.todayRevenue.toLocaleString()} <Birr className="text-base" /></h3>
              <p className="text-sm text-gray-300 mt-2">Revenue generated today</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <Birr className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Weekly Appointments</h3>
              <p className="text-[#16C79A]/80 text-sm">Appointments trend this week</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaChartLine className="text-xl text-[#16C79A]" />
            </div>
          </div>
          <Bar 
            data={appointmentsData} 
            options={{ 
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#94a3b8'
                  },
                  grid: {
                    color: 'rgba(88, 174, 252, 0.1)'
                  }
                },
                x: {
                  ticks: {
                    color: '#94a3b8'
                  },
                  grid: {
                    color: 'rgba(22, 199, 154, 0.1)'
                  }
                }
              }
            }} 
          />
        </div>

        <div className="bg-gradient-to-br from-[#11698E] to-[#19456B] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Appointment Status</h3>
              <p className="text-[#16C79A]/80 text-sm">Distribution by status</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaCalendarAlt className="text-xl text-[#16C79A]" />
            </div>
          </div>
          <div className="h-64">
            <Pie 
              data={{
                labels: ['Approved', 'Pending', 'Completed', 'Cancelled'],
                datasets: [{
                  data: [
                    stats.approvedAppointments,
                    stats.pendingAppointments,
                    stats.completedAppointments,
                    stats.cancelledAppointments
                  ],
                  backgroundColor: [
                    'rgba(88, 174, 252, 0.8)',
                    'rgba(183, 224, 255, 0.8)',
                    'rgba(47, 149, 249, 0.8)',
                    'rgba(25, 119, 230, 0.8)'
                  ],
                  borderColor: [
                    '#58aefc',
                    '#b7e0ff',
                    '#2f95f9',
                    '#1977e6'
                  ],
                  borderWidth: 2,
                }]
              }} 
              options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: '#e2e8f0',
                      font: {
                        size: 12
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl overflow-hidden shadow-xl mb-10">
        <div className="flex items-center justify-between p-6 border-b border-[#16C79A]/20">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Recent Appointments</h3>
            <p className="text-[#16C79A]/80 text-sm">Latest 5 appointments</p>
          </div>
          <button 
            className="px-4 py-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium"
            onClick={() => window.location.href = '/appointments'}
          >
            View All Appointments
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 border-b border-[#16C79A]/20">
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Patient</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Doctor</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Date & Time</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.slice(0, 5).map((appointment) => (
                <tr 
                  key={appointment._id} 
                  className="border-b border-[#16C79A]/10 hover:bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 transition-all duration-300"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{appointment.patientId?.name || 'N/A'}</div>
                    <div className="text-sm text-[#16C79A]/70">{appointment.patientId?.email || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">Dr. {appointment.doctorId?.name || 'N/A'}</div>
                    <div className="text-sm text-[#16C79A]/70">{appointment.doctorId?.specialization || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white">{formatDate(appointment.date)}</div>
                    <div className="text-sm text-[#16C79A]/70">{appointment.time || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(appointment.status)}
                  </td>
                </tr>
              ))}
              
              {recentAppointments.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-[#16C79A]/70">
                    No recent appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#16C79A] to-[#11698E] text-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white/20">
              <FaCalendarCheck className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">Approved</p>
              <p className="text-3xl font-bold">{stats.approvedAppointments}</p>
              <p className="text-xs text-white/60 mt-2">Confirmed appointments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white/20">
              <FaUserInjured className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">Pending</p>
              <p className="text-3xl font-bold">{stats.pendingAppointments}</p>
              <p className="text-xs text-white/60 mt-2">Awaiting confirmation</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white/20">
              <FaCalendarCheck className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">Completed</p>
              <p className="text-3xl font-bold">{stats.completedAppointments}</p>
              <p className="text-xs text-white/60 mt-2">Finished appointments</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-white/20">
              <FaCalendarTimes className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">Cancelled</p>
              <p className="text-3xl font-bold">{stats.cancelledAppointments}</p>
              <p className="text-xs text-white/60 mt-2">Cancelled appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;