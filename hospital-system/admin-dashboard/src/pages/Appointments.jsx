import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaUserMd, FaUser, FaClock, FaEye, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

// Simple Birr icon component (used instead of FaDollarSign)
const Birr = ({ className }) => (
  <span className={className} aria-hidden="true">Br</span>
);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      fetchDashboardStats();
    }
  }, [appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/admin/appointments');
      // Check if response.data is an object with appointments array
      if (response.data && response.data.appointments) {
        setAppointments(response.data.appointments);
      } else if (Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        setAppointments([]);
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Calculate today's date
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      // Get today's appointments from the fetched appointments
      const appointmentsArray = Array.isArray(appointments) ? appointments : [];
      const todayAppointmentsList = appointmentsArray.filter(app => {
        if (!app.date) return false;
        const appointmentDate = new Date(app.date).toISOString().split('T')[0];
        return appointmentDate === todayStr;
      });
      
      // Calculate today's revenue
      const todayRevenue = todayAppointmentsList.reduce((total, app) => {
        if (app.status === 'approved' || app.status === 'completed') {
          return total + (app.amount || 50);
        }
        return total;
      }, 0);
      
      setStats({
        totalAppointments: appointmentsArray.length,
        pendingAppointments: appointmentsArray.filter(a => a.status === 'pending').length,
        todayAppointments: todayAppointmentsList.length,
        todayRevenue: todayRevenue
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
      // Fallback calculations
      const appointmentsArray = Array.isArray(appointments) ? appointments : [];
      const today = new Date().toISOString().split('T')[0];
      const todayAppointmentsList = appointmentsArray.filter(app => {
        if (!app.date) return false;
        const appointmentDate = new Date(app.date).toISOString().split('T')[0];
        return appointmentDate === today;
      });
      
      const todayRevenue = todayAppointmentsList.reduce((total, app) => {
        if (app.status === 'approved' || app.status === 'completed') {
          return total + (app.amount || 50);
        }
        return total;
      }, 0);
      
      setStats({
        totalAppointments: appointmentsArray.length,
        pendingAppointments: appointmentsArray.filter(a => a.status === 'pending').length,
        todayAppointments: todayAppointmentsList.length,
        todayRevenue: todayRevenue
      });
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/admin/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      toast.success(`Appointment ${newStatus} successfully`);
      
      // Refresh appointments
      await fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update appointment status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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

  const getRevenueForAppointment = (appointment) => {
    const amount = appointment.amount || 50;
    if (appointment.status === 'approved' || appointment.status === 'completed') {
      return (
        <>
          {amount.toLocaleString()} <Birr className="inline-block text-sm" />
        </>
      );
    }
    return (
      <>
        0 <Birr className="inline-block text-sm" />
      </>
    );
  };

  // Make sure appointments is always treated as an array
  const appointmentsArray = Array.isArray(appointments) ? appointments : [];

  const filteredAppointments = appointmentsArray.filter(appointment => {
    const patientName = appointment.patientId?.name || '';
    const doctorName = appointment.doctorId?.name || '';
    const symptoms = appointment.symptoms || '';
    
    const matchesSearch = 
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
    
    const matchesDate = !selectedDate || 
      (appointment.date && new Date(appointment.date).toISOString().split('T')[0] === selectedDate);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const uniqueDoctorNames = [...new Set(
    appointmentsArray
      .map(a => a.doctorId?.name)
      .filter(name => name && name.trim() !== '')
  )];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16C79A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Appointments Management</h1>
        <p className="text-[#16C79A]/80 mt-2">Manage all appointments in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium">Total Appointments</p>
              <h3 className="text-2xl font-bold mt-2">{stats.totalAppointments.toLocaleString()}</h3>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaCalendarAlt className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#11698E] to-[#19456B] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium">Pending</p>
              <h3 className="text-2xl font-bold mt-2">{stats.pendingAppointments}</h3>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaClock className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium">Today's Appointments</p>
              <h3 className="text-2xl font-bold mt-2">{stats.todayAppointments}</h3>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <FaCalendarAlt className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#11698E] to-[#19456B] border border-[#16C79A]/20 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#16C79A]/80 text-sm font-medium">Revenue Today</p>
              <h3 className="text-2xl font-bold mt-2">
                {stats.todayRevenue.toLocaleString()} <Birr className="text-base" />
              </h3>
              <div className="flex items-center mt-2">
                <span className="text-sm text-[#16C79A]/80">
                  {stats.todayAppointments} appointments today
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/20">
              <Birr className="text-2xl text-[#16C79A]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label text-[#16C79A]/80">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#16C79A]/60" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full pl-10 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label text-[#16C79A]/80">Status</label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#16C79A]/60" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all" className="bg-[#0d2c4a]">All Status</option>
                <option value="pending" className="bg-[#0d2c4a]">Pending</option>
                <option value="approved" className="bg-[#0d2c4a]">Approved</option>
                <option value="completed" className="bg-[#0d2c4a]">Completed</option>
                <option value="cancelled" className="bg-[#0d2c4a]">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label text-[#16C79A]/80">Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label className="label text-[#16C79A]/80">Doctor</label>
            <select className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]">
              <option value="" className="bg-[#0d2c4a]">All Doctors</option>
              {uniqueDoctorNames.map(name => (
                <option key={name} value={name} className="bg-[#0d2c4a]">{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 border-b border-[#16C79A]/20">
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Patient</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Doctor</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Date & Time</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Status</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Revenue</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => {
                const appointmentDate = appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : null;
                const today = new Date().toISOString().split('T')[0];
                const isToday = appointmentDate === today;
                
                return (
                  <tr key={appointment._id} className={`border-b border-[#16C79A]/10 hover:bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 transition-all duration-300 ${isToday ? 'bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-full flex items-center justify-center text-white font-bold">
                          {appointment.patientId?.name?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="font-medium text-white">{appointment.patientId?.name || 'N/A'}</p>
                          <p className="text-xs text-[#16C79A]/70">{appointment.patientId?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {appointment.doctorId?.name?.charAt(0).toUpperCase() || 'D'}
                        </div>
                        <div>
                          <p className="font-medium text-white">Dr. {appointment.doctorId?.name || 'N/A'}</p>
                          <p className="text-xs text-[#16C79A]/70">{appointment.doctorId?.specialization || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#16C79A]/60 text-sm" />
                        <div>
                          <p className="text-sm text-white">{formatDate(appointment.date)}</p>
                          <p className="text-xs text-[#16C79A]/70">{appointment.time || 'N/A'}</p>
                          {isToday && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A] rounded">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className={`font-medium ${(appointment.status === 'approved' || appointment.status === 'completed') ? 'text-[#16C79A]' : 'text-gray-400'}`}>
                        {getRevenueForAppointment(appointment)}
                      </div>
                      {isToday && (appointment.status === 'approved' || appointment.status === 'completed') && (
                        <div className="text-xs text-[#16C79A] mt-1">
                          +{(appointment.amount || 50).toLocaleString()} <Birr className="inline-block text-sm" /> to today's revenue
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button className="p-2 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 rounded-lg transition-all duration-300" title="View Details">
                          <FaEye />
                        </button>
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'approved')}
                              className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-all duration-300"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                              className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {appointment.status === 'approved' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                              className="p-2 text-teal-500 hover:bg-teal-500/20 rounded-lg transition-all duration-300"
                              title="Mark as Completed"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                              className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarAlt className="text-5xl text-[#16C79A]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No appointments found</h3>
            <p className="text-[#16C79A]/70">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;