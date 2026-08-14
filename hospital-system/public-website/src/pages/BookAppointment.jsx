import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaStethoscope, 
  FaCheck,
  FaInfoCircle,
  FaArrowRight,
  FaCalendarCheck,
  FaStar,
  FaCalendarDay
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    symptoms: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && formData.date) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, formData.date]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      if (Array.isArray(response.data)) {
        setDoctors(response.data);
      } else if (response.data && Array.isArray(response.data.doctors)) {
        setDoctors(response.data.doctors);
      } else if (response.data && response.data.data) {
        setDoctors(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = () => {
    const slots = [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'
    ];
    setAvailableSlots(slots);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ date: '', time: '', symptoms: '' });
    setAvailableSlots([]);
    setShowConfirmation(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmAppointment = async () => {
    try {
      const payload = {
        doctorId: selectedDoctor && (selectedDoctor._id || selectedDoctor.id),
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms || ''
      };

      const res = await api.post('/appointments', payload);
      if (res && (res.status === 200 || res.status === 201)) {
        toast.success('Appointment booked successfully');
        setShowConfirmation(false);
        setFormData({ date: '', time: '', symptoms: '' });
        setSelectedDoctor(null);
      } else {
        toast.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      const message = error?.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
    }
  };

  return (
    <div className="book-appointment-page" style={{ padding: 20 }}>
      <h2>Book Appointment</h2>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Doctors</h3>
          {loading ? (
            <p>Loading doctors...</p>
          ) : (
            <div>
              {doctors.length === 0 && <p>No doctors available</p>}
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {doctors.map((doc) => (
                  <li key={doc._id || doc.id} style={{ marginBottom: 10 }}>
                    <div style={{ border: selectedDoctor && (selectedDoctor._id === (doc._id || doc.id)) ? '2px solid #007bff' : '1px solid #ccc', padding: 10, borderRadius: 6 }}>
                      <div style={{ fontWeight: 'bold' }}>{doc.name || doc.fullName || 'Doctor'}</div>
                      <div>{doc.specialization || doc.speciality || 'General'}</div>
                      <button onClick={() => handleSelectDoctor(doc)} style={{ marginTop: 8 }}>Select</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3>Appointment Details</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label>Date</label><br />
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Time</label><br />
              <select name="time" value={formData.time} onChange={handleChange}>
                <option value="">Select time</option>
                {availableSlots.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Symptoms</label><br />
              <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} rows={3} />
            </div>

            <div>
              <button type="submit">Review</button>
            </div>
          </form>

          {showConfirmation && (
            <div style={{ marginTop: 20, padding: 12, border: '1px solid #ccc', borderRadius: 6 }}>
              <h4>Confirm Appointment</h4>
              <p><strong>Doctor:</strong> {selectedDoctor?.name || selectedDoctor?.fullName}</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.time}</p>
              <p><strong>Symptoms:</strong> {formData.symptoms}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                <button onClick={confirmAppointment}>Confirm</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
