import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaFilter, 
  FaDownload, 
  FaSearch,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaFileMedical,
  FaChevronRight,
  FaCalendarCheck,
  FaCalendarTimes,
  FaEye,
  FaPhone,
  FaMapMarkerAlt,
  FaDollarSign,
  FaHospital,
  FaUser,
  FaFileAlt,
  FaCalendar,
  FaClipboardList
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter, searchTerm]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get('http://localhost:5000/api/appointments/patient', config);
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.doctorId?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10',
        text: 'text-yellow-300',
        border: 'border-yellow-500/30',
        icon: <FaExclamationTriangle className="text-yellow-400" size={12} />
      },
      approved: {
        bg: 'bg-gradient-to-r from-[#16C79A]/20 to-emerald-500/10',
        text: 'text-[#16C79A]',
        border: 'border-[#16C79A]/30',
        icon: <FaCheck className="text-[#16C79A]" size={12} />
      },
      cancelled: {
        bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/10',
        text: 'text-red-300',
        border: 'border-red-500/30',
        icon: <FaTimes className="text-red-400" size={12} />
      },
      completed: {
        bg: 'bg-gradient-to-r from-[#11698E]/20 to-blue-500/10',
        text: 'text-[#11698E]',
        border: 'border-[#16C79A]/30',
        icon: <FaCalendarCheck className="text-[#11698E]" size={12} />
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-900/20',
      text: 'text-gray-300',
      border: 'border-gray-500/30',
      icon: <FaCalendarAlt className="text-gray-400" size={12} />
    };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border} ${config.text} text-sm font-medium`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.patch(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: 'cancelled' },
        config
      );

      toast.success('Appointment cancelled successfully', {
        icon: '✅',
        duration: 3000
      });
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FaExclamationTriangle className="text-yellow-400" />;
      case 'approved': return <FaCheck className="text-[#16C79A]" />;
      case 'completed': return <FaCalendarCheck className="text-[#11698E]" />;
      case 'cancelled': return <FaCalendarTimes className="text-red-400" />;
      default: return <FaCalendarAlt className="text-gray-400" />;
    }
  };

  return (
    <div className="p-4 md:p-6  min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Appointments</h1>
        <p className="text-[#16C79A]/80 mt-2">Manage and track all your medical appointments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-5 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 font-medium">Total Appointments</p>
              <h3 className="text-2xl font-bold text-white mt-1">{appointments.length}</h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#16C79A]/20 to-[#16C79A]/10 rounded-xl border border-[#16C79A]/20">
              <FaCalendarAlt className="text-xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-5 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 font-medium">Upcoming</p>
              <h3 className="text-2xl font-bold text-[#16C79A] mt-1">
                {appointments.filter(a => a.status === 'approved' && new Date(a.date) > new Date()).length}
              </h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#16C79A]/20 to-[#16C79A]/10 rounded-xl border border-[#16C79A]/20">
              <FaCheck className="text-xl text-[#16C79A]" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-yellow-500/20 p-5 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 font-medium">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-400 mt-1">
                {appointments.filter(a => a.status === 'pending').length}
              </h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 rounded-xl border border-yellow-500/20">
              <FaExclamationTriangle className="text-xl text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-5 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 font-medium">Completed</p>
              <h3 className="text-2xl font-bold text-[#11698E] mt-1">
                {appointments.filter(a => a.status === 'completed').length}
              </h3>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#11698E]/20 to-[#11698E]/10 rounded-xl border border-[#16C79A]/20">
              <FaFileMedical className="text-xl text-[#11698E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#16C79A]" />
              <input
                type="text"
                placeholder="Search appointments by doctor, specialization, or symptoms..."
                className="w-full pl-12 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent text-white placeholder:text-[#16C79A]/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#16C79A]" />
              <select
                className="pl-12 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent text-white appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-[#0d2c4a]">All Status</option>
                <option value="pending" className="bg-[#0d2c4a]">Pending</option>
                <option value="approved" className="bg-[#0d2c4a]">Approved</option>
                <option value="completed" className="bg-[#0d2c4a]">Completed</option>
                <option value="cancelled" className="bg-[#0d2c4a]">Cancelled</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <FaChevronRight className="text-[#16C79A] rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16C79A]"></div>
        </div>
      ) : (
        <>
          {/* Appointments List */}
          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Doctor Info */}
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="p-4 bg-gradient-to-br from-[#16C79A]/20 to-[#11698E]/10 rounded-xl border border-[#16C79A]/20">
                            {getStatusIcon(appointment.status)}
                          </div>
                          <div className="absolute -bottom-2 -right-2">
                            {getStatusBadge(appointment.status)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">
                            {appointment.doctorId?.name || 'Doctor'}
                          </h3>
                          <p className="text-[#16C79A] font-medium">
                            {appointment.doctorId?.specialization || 'Specialization'}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white rounded-lg text-sm border border-[#16C79A]/20">
                              <FaCalendarAlt className="text-[#16C79A]" />
                              {formatDate(appointment.date)}
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white rounded-lg text-sm border border-[#16C79A]/20">
                              <FaClock className="text-[#16C79A]" />
                              {appointment.time}
                            </span>
                            {appointment.doctorId?.contactNumber && (
                              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white rounded-lg text-sm border border-[#16C79A]/20">
                                <FaPhone className="text-[#16C79A]" />
                                {appointment.doctorId.contactNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col items-start lg:items-end gap-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedAppointment(appointment)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#16C79A]/10 to-[#16C79A]/5 text-[#16C79A] font-medium rounded-lg hover:shadow-sm transition-all border border-[#16C79A]/20 hover:border-[#16C79A]"
                          >
                            <FaEye />
                            View Details
                          </button>
                          {appointment.status === 'pending' && (
                            <button 
                              onClick={() => cancelAppointment(appointment._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-300 font-medium rounded-lg hover:shadow-sm transition-all border border-red-500/20 hover:border-red-400"
                            >
                              <FaTimes />
                              Cancel
                            </button>
                          )}
                          {(appointment.status === 'completed' || appointment.status === 'approved') && (
                            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#11698E]/10 to-[#11698E]/5 text-[#11698E] font-medium rounded-lg hover:shadow-sm transition-all border border-[#16C79A]/20 hover:border-[#11698E]">
                              <FaDownload />
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Symptoms */}
                    {appointment.symptoms && (
                      <div className="mt-6 pt-6 border-t border-[#16C79A]/20">
                        <div className="flex items-start gap-2">
                          <div className="text-[#16C79A]">
                            <FaClipboardList size={18} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2">Symptoms / Reason:</h4>
                            <p className="text-[#16C79A]/80 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] p-3 rounded-lg border border-[#16C79A]/20">
                              {appointment.symptoms}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/80 rounded-full border border-[#16C79A]/20">
                        <FaMapMarkerAlt className="text-[#16C79A]" size={10} />
                        Room {appointment.doctorId?.roomNumber || '101'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/80 rounded-full border border-[#16C79A]/20">
                        <FaDollarSign className="text-[#16C79A]" size={10} />
                        Consultation: $50
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/80 rounded-full border border-[#16C79A]/20">
                        <FaHospital className="text-[#16C79A]" size={10} />
                        {appointment.doctorId?.hospital || 'Main Hospital'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-12 text-center">
              <div className="text-[#16C79A]/30 text-6xl mb-4">
                <FaCalendar size={64} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No appointments match your search' 
                  : 'No appointments yet'}
              </h3>
              <p className="text-[#16C79A]/80 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters' 
                  : 'Schedule your first appointment to begin your healthcare journey'}
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <a 
                  href="/patient/book-appointment" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white font-bold rounded-xl hover:shadow-lg transition-all border border-[#16C79A]/30"
                >
                  <FaCalendarAlt />
                  Book Your First Appointment
                </a>
              )}
            </div>
          )}
        </>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#16C79A]/20 shadow-2xl">
            <div className="p-6 border-b border-[#16C79A]/20">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Appointment Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-gradient-to-r hover:from-[#16C79A]/10 hover:to-[#11698E]/10 rounded-lg transition-all"
                >
                  <FaTimes className="text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[#16C79A]/80">Doctor</label>
                    <p className="font-semibold text-white">{selectedAppointment.doctorId?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#16C79A]/80">Specialization</label>
                    <p className="font-semibold text-[#16C79A]">{selectedAppointment.doctorId?.specialization}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#16C79A]/80">Date & Time</label>
                    <p className="font-semibold text-white">
                      {formatDate(selectedAppointment.date)} at {selectedAppointment.time}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[#16C79A]/80">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedAppointment.status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#16C79A]/80">Consultation Fee</label>
                    <p className="text-xl font-bold text-[#16C79A]">$50.00</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#16C79A]/80">Room Number</label>
                    <p className="font-semibold text-white">{selectedAppointment.doctorId?.roomNumber || '101'}</p>
                  </div>
                </div>
              </div>
              
              {selectedAppointment.symptoms && (
                <div className="mb-6">
                  <label className="text-sm text-[#16C79A]/80 mb-2 block">Symptoms / Reason</label>
                  <div className="bg-gradient-to-r from-[#0d2c4a] to-[#19456B] p-4 rounded-xl border border-[#16C79A]/20">
                    <p className="text-white">{selectedAppointment.symptoms}</p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white font-medium rounded-xl hover:bg-gradient-to-r hover:from-[#0d2c4a]/80 hover:to-[#19456B]/80 transition-all border border-[#16C79A]/20"
                >
                  Close
                </button>
                {selectedAppointment.status === 'pending' && (
                  <button 
                    onClick={() => {
                      cancelAppointment(selectedAppointment._id);
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all border border-transparent"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;