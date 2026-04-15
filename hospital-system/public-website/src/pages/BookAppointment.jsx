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
import axios from 'axios';
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
      console.log('Fetching doctors...');
      const response = await axios.get('http://localhost:5000/api/doctors');
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      if (Array.isArray(response.data)) {
        setDoctors(response.data);
      } else if (response.data && Array.isArray(response.data.doctors)) {
        setDoctors(response.data.doctors);
      } else if (response.data && response.data.data) {
        setDoctors(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        console.warn('Unexpected response format:', response.data);
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
      '02:30 AM', '03:30 AM', '04:30 AM', '05:30 PM', '07:30 PM','08:30 PM','09:30 PM','10:30 PM','11:30 PM'
    ];
    setAvailableSlots(slots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const appointmentData = {
        doctorId: selectedDoctor._id,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms
      };

      await axios.post('http://localhost:5000/api/appointments', appointmentData, config);
      
      toast.success('Appointment booked successfully!', {
        duration: 4000,
        icon: '✅'
      });
      navigate('/patient/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setShowConfirmation(false);
    }
  };

  const specializations = [
    { value: 'all', label: 'All Specializations', icon: '👨‍⚕️' },
    { value: 'Cardiology', label: 'Cardiology', icon: '❤️' },
    { value: 'Dermatology', label: 'Dermatology', icon: '🧴' },
    { value: 'Neurology', label: 'Neurology', icon: '🧠' },
    { value: 'Orthopedics', label: 'Orthopedics', icon: '🦴' },
    { value: 'Pediatrics', label: 'Pediatrics', icon: '👶' },
    { value: 'Gynecology', label: 'Gynecology', icon: '👩' },
    { value: 'General Medicine', label: 'General Medicine', icon: '🩺' },
    { value: 'Dentistry', label: 'Dentistry', icon: '🦷' }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4 md:p-6  min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Book Appointment</h1>
        <div className="flex items-center gap-2 text-[#16C79A] mt-2">
          <FaInfoCircle />
          <p>Select a doctor and schedule your appointment in 3 easy steps</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center w-full max-w-3xl">
          <div className={`flex items-center ${selectedDoctor ? 'text-[#16C79A]' : 'text-white/50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedDoctor ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white' : 'bg-gradient-to-r from-[#0d2c4a]/50 to-[#19456B]/50 border-2 border-[#16C79A]/30'}`}>
              1
            </div>
            <span className="ml-2 font-medium">Select Doctor</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${selectedDoctor ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E]' : 'bg-[#16C79A]/20'}`}></div>
          
          <div className={`flex items-center ${selectedDoctor ? 'text-[#16C79A]' : 'text-white/50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedDoctor ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white' : 'bg-gradient-to-r from-[#0d2c4a]/50 to-[#19456B]/50 border-2 border-[#16C79A]/30'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Schedule Time</span>
          </div>
          
          <div className={`flex-1 h-1 mx-4 ${formData.time ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E]' : 'bg-[#16C79A]/20'}`}></div>
          
          <div className={`flex items-center ${formData.time ? 'text-[#16C79A]' : 'text-white/50'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.time ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white' : 'bg-gradient-to-r from-[#0d2c4a]/50 to-[#19456B]/50 border-2 border-[#16C79A]/30'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctor Selection */}
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#16C79A]/20 to-[#16C79A]/10 rounded-xl border border-[#16C79A]/20">
              <FaUserMd className="text-xl text-[#16C79A]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">1. Select Doctor</h2>
              <p className="text-sm text-[#16C79A]/80">Choose from our expert medical professionals</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#16C79A]" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                className="w-full pl-12 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent text-white placeholder:text-[#16C79A]/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Specialization Filter</label>
              <div className="flex flex-wrap gap-2">
                {specializations.map(spec => (
                  <button
                    key={spec.value}
                    type="button"
                    onClick={() => setSelectedSpecialization(spec.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      selectedSpecialization === spec.value
                        ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white border-transparent shadow-md'
                        : 'bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/80 border-[#16C79A]/20 hover:border-[#16C79A] hover:bg-gradient-to-r hover:from-[#16C79A]/10 hover:to-[#11698E]/10'
                    }`}
                  >
                    <span>{spec.icon}</span>
                    <span>{spec.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Doctors List */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16C79A]"></div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedDoctor?._id === doctor._id
                      ? 'bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 border-[#16C79A] shadow-md'
                      : 'bg-gradient-to-r from-[#19456B]/50 to-[#0d2c4a]/50 border-[#16C79A]/10 hover:border-[#16C79A]/50 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#16C79A] to-[#11698E] flex items-center justify-center text-white font-bold text-lg border-2 border-white/20 shadow-lg">
                        {doctor.name?.charAt(0) || 'D'}
                      </div>
                      {selectedDoctor?._id === doctor._id && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[#16C79A] to-[#11698E] rounded-full flex items-center justify-center border-2 border-[#19456B]">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white">Dr. {doctor.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#16C79A]/10 to-[#16C79A]/5 text-[#16C79A] text-xs font-medium rounded-full border border-[#16C79A]/20">
                              <FaStethoscope size={10} />
                              {doctor.specialization || 'General Medicine'}
                            </span>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-400" size={12} />
                              <span className="text-xs text-white/70">4.8</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#16C79A]">Birr 550</div>
                          <div className="text-xs text-[#16C79A]/80">consultation</div>
                        </div>
                      </div>
                      
                      {doctor.availableTime && doctor.availableTime.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-[#16C79A]/80">
                          <FaClock size={12} />
                          <span>Available: {doctor.availableTime[0].day} {doctor.availableTime[0].startTime} - {doctor.availableTime[0].endTime}</span>
                        </div>
                      )}
                      
                      <div className="mt-3 flex gap-2">
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/80 rounded border border-[#16C79A]/20">
                          ⏱️ 15 min avg wait
                        </span>
                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/80 rounded border border-[#16C79A]/20">
                          💬 English, Amharic and Afan Oromo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDoctors.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-5xl text-[#16C79A]/30 mb-4">👨‍⚕️</div>
                  <p className="text-white font-medium">No doctors found</p>
                  <p className="text-[#16C79A]/70 text-sm mt-1">Try adjusting your search or filter</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Appointment Form */}
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl shadow-xl border border-[#16C79A]/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#11698E]/20 to-[#11698E]/10 rounded-xl border border-[#16C79A]/20">
              <FaCalendarCheck className="text-xl text-[#16C79A]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">2. Schedule Appointment</h2>
              <p className="text-sm text-[#16C79A]/80">Choose date and time for your visit</p>
            </div>
          </div>
          
          {selectedDoctor ? (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-xl border border-[#16C79A]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#16C79A] to-[#11698E] flex items-center justify-center text-white font-bold border-2 border-white/20 shadow">
                  {selectedDoctor.name?.charAt(0) || 'D'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white">Dr. {selectedDoctor.name}</h3>
                      <p className="text-[#16C79A] font-medium">{selectedDoctor.specialization}</p>
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="text-sm text-[#16C79A] hover:text-white transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/20 to-amber-900/20 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="text-amber-400 text-2xl">⚠️</div>
                <div>
                  <p className="font-medium text-amber-300">Please select a doctor first</p>
                  <p className="text-sm text-amber-400/80 mt-1">Choose a doctor from the list to proceed</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#16C79A]" />
                    Appointment Date
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent text-white placeholder:text-[#16C79A]/60"
                    min={today}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                    disabled={!selectedDoctor}
                  />
                </div>
              </div>

              {formData.date && (
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#16C79A]" />
                      Select Time Slot
                    </div>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className={`p-3 border rounded-xl text-center transition-all duration-200 ${
                          formData.time === slot
                            ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white border-transparent shadow-md transform scale-[1.02]'
                            : 'bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/80 border-[#16C79A]/20 hover:border-[#16C79A] hover:bg-gradient-to-r hover:from-[#16C79A]/10 hover:to-[#11698E]/10'
                        }`}
                        onClick={() => setFormData({...formData, time: slot})}
                      >
                        <div className="flex flex-col items-center">
                          <FaClock className={`mb-1 ${formData.time === slot ? 'text-white' : 'text-[#16C79A]'}`} />
                          <span className="font-medium">{slot}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {availableSlots.length === 0 && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] rounded-lg border border-[#16C79A]/20">
                      <p className="text-[#16C79A] text-sm">No available slots for selected date. Please choose another date.</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Symptoms / Reason for Visit (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:border-transparent text-white placeholder:text-[#16C79A]/60 min-h-[120px] resize-none"
                  placeholder="Describe your symptoms or reason for appointment..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  disabled={!selectedDoctor}
                />
              </div>

              <div className="pt-6 border-t border-[#16C79A]/20">
                <div className="bg-gradient-to-r from-[#0d2c4a] to-[#19456B] p-5 rounded-xl mb-6 border border-[#16C79A]/20">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-[#16C79A]" />
                    Appointment Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#16C79A]/80">Doctor:</span>
                      <span className="font-medium text-white">
                        {selectedDoctor ? `Dr. ${selectedDoctor.name}` : 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#16C79A]/80">Specialization:</span>
                      <span className="font-medium text-[#16C79A]">
                        {selectedDoctor?.specialization || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#16C79A]/80">Date:</span>
                      <span className="font-medium text-white">
                        {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#16C79A]/80">Time:</span>
                      <span className="font-medium text-white">{formData.time || 'Not selected'}</span>
                    </div>
                    <div className="pt-3 border-t border-[#16C79A]/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[#16C79A]/80">Consultation Fee:</span>
                        <span className="text-xl font-bold text-[#16C79A]">Birr 550.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedDoctor || !formData.date || !formData.time}
                  className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    !selectedDoctor || !formData.date || !formData.time
                      ? 'bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white/30 cursor-not-allowed border border-[#16C79A]/10'
                      : 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-transparent'
                  }`}
                >
                  <FaCalendarDay />
                  Confirm Appointment
                  <FaArrowRight />
                </button>

                <div className="mt-4 p-3 bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg border border-blue-500/20">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 text-sm">ℹ️</span>
                    <p className="text-xs text-[#16C79A]">
                      You will receive a confirmation email and SMS after booking. 
                      Please arrive 15 minutes before your scheduled time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] rounded-2xl p-6 max-w-md w-full border border-[#16C79A]/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#16C79A] to-[#11698E] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                <FaCalendarCheck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Confirm Appointment</h3>
              <p className="text-[#16C79A]">Are you sure you want to book this appointment?</p>
            </div>
            
            <div className="mb-6 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] p-4 rounded-xl border border-[#16C79A]/20">
              <div className="space-y-2">
                <p className="font-medium text-white">Dr. {selectedDoctor?.name}</p>
                <p className="text-sm text-[#16C79A]">{selectedDoctor?.specialization}</p>
                <p className="text-sm text-white">
                  {formData.date} at {formData.time}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 bg-gradient-to-r from-[#0d2c4a] to-[#19456B] text-white font-medium rounded-xl hover:bg-gradient-to-r hover:from-[#0d2c4a]/80 hover:to-[#19456B]/80 transition-all border border-[#16C79A]/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmAppointment}
                className="flex-1 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white font-bold rounded-xl hover:shadow-lg transition-all border border-transparent"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
