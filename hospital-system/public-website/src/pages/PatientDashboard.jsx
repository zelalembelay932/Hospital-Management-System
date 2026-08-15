import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaBell, 
  FaPlus, 
  FaHistory,
  FaFileMedical,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaUserInjured,
  FaChevronRight,
  FaDownload,
  FaEye,
  FaTimesCircle
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcoming: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [apptsRes, notesRes] = await Promise.all([
        api.get('/appointments/patient'),
        api.get('/notifications/')
      ]);
      const appts = apptsRes?.data || [];
      const notes = notesRes?.data || [];
      setAppointments(Array.isArray(appts) ? appts : (appts.appointments || appts.data || []));
      setNotifications(Array.isArray(notes) ? notes : (notes.notifications || notes.data || []));
      setStats({
        totalAppointments: Array.isArray(appts) ? appts.length : (appts.total || 0),
        upcoming: 0,
        completed: 0,
        pending: 0
      });
    } catch (err) {
      console.error('Dashboard load error', err);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Patient Dashboard</h2>
      {loading ? <p>Loading...</p> : (
        <div>
          <div>Total Appointments: {stats.totalAppointments}</div>
          <div>
            <h3>Upcoming Appointments</h3>
            <ul>
              {appointments.map(a => (
                <li key={a._id || a.id}>{a.date} - {a.time} with {a.doctorName || (a.doctor && a.doctor.name)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
