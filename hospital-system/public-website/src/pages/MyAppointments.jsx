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
import api from '../services/api';
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
      const res = await api.get('/appointments/my');
      if (res && res.data) {
        setAppointments(Array.isArray(res.data) ? res.data : (res.data.appointments || res.data.data || []));
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      toast.error('Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let list = [...appointments];
    if (statusFilter !== 'all') {
      list = list.filter(a => (a.status || '').toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchTerm) {
      list = list.filter(a => (a.doctorName || a.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredAppointments(list);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Appointments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {filteredAppointments.length === 0 ? (
            <p>No appointments found</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredAppointments.map(appt => (
                <li key={appt._id || appt.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8, borderRadius: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{appt.doctorName || (appt.doctor && (appt.doctor.name || appt.doctor.fullName))}</div>
                      <div>{appt.date} - {appt.time}</div>
                    </div>
                    <div>
                      <div>Status: {appt.status || 'pending'}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
