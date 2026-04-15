import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaSearch, FaEdit, FaTrash, FaUserMd, 
  FaFilter, FaEye, FaPhone, FaEnvelope, FaCalendarAlt,
  FaTimes, FaCheck, FaClock, FaUserInjured
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    phone: '',
    availableTime: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }]
  });

  const [editDoctor, setEditDoctor] = useState({
    name: '',
    email: '',
    specialization: '',
    phone: '',
    status: 'active',
    availableTime: []
  });

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'General Medicine',
    'Dentistry',
    'Psychiatry',
    'Ophthalmology'
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/doctors');
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await api.get(`/admin/doctors/${doctorId}`);
      setEditDoctor({
        name: response.data.name,
        email: response.data.email,
        specialization: response.data.specialization || '',
        phone: response.data.phone || '',
        status: response.data.isActive ? 'active' : 'inactive',
        availableTime: response.data.availableTime || [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }]
      });
    } catch (error) {
      toast.error('Failed to load doctor details');
    }
  };

  const fetchDoctorAppointments = async (doctorId) => {
    try {
      setLoadingAppointments(true);
      const response = await api.get(`/appointments/doctor/${doctorId}`);
      setDoctorAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleViewDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
    await fetchDoctorAppointments(doctor._id);
  };

  const handleEditDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    await fetchDoctorDetails(doctor._id);
    setShowEditModal(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/doctors/${selectedDoctor._id}`, editDoctor);
      toast.success('Doctor updated successfully');
      setShowEditModal(false);
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update doctor');
    }
  };

  const handleStatusToggle = async (doctorId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await api.patch(`/admin/doctors/${doctorId}/status`, { status: newStatus });
      toast.success(`Doctor ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return;

    try {
      await api.delete(`/admin/doctors/${doctorId}`);
      toast.success('Doctor deleted successfully');
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/doctors', newDoctor);
      toast.success('Doctor added successfully');
      setShowAddModal(false);
      setNewDoctor({
        name: '',
        email: '',
        password: '',
        specialization: '',
        phone: '',
        availableTime: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }]
      });
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    }
  };

  const addAvailableTimeSlot = () => {
    setEditDoctor({
      ...editDoctor,
      availableTime: [...editDoctor.availableTime, { day: 'Monday', startTime: '09:00', endTime: '17:00' }]
    });
  };

  const removeAvailableTimeSlot = (index) => {
    const updatedTimeSlots = [...editDoctor.availableTime];
    updatedTimeSlots.splice(index, 1);
    setEditDoctor({ ...editDoctor, availableTime: updatedTimeSlots });
  };

  const updateTimeSlot = (index, field, value) => {
    const updatedTimeSlots = [...editDoctor.availableTime];
    updatedTimeSlots[index][field] = value;
    setEditDoctor({ ...editDoctor, availableTime: updatedTimeSlots });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 doctor.specialization === selectedSpecialization;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' ? doctor.isActive : !doctor.isActive);
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58aefc]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-[#0f4989] to-[#0b3561] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Doctors Management</h1>
          <p className="text-[#58aefc]/80">Manage all doctors in the system</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#58aefc] to-[#145fb8] text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-3 mt-4 md:mt-0 shadow-lg hover:shadow-xl"
        >
          <FaPlus />
          Add New Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] border border-[#58aefc]/20 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label text-[#16C79A]/80">Search Doctors</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#58aefc]/60" />
              <input
                type="text"
                placeholder="Search by name, email, or specialization..."
                className="w-full pl-10 pr-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
              <label className="label text-[#58aefc]/80">Specialization</label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#58aefc]/60" />
              <select
                className="w-full pl-10 pr-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="all" className="bg-[#0d2c4a]">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec} className="bg-[#0d2c4a]">{spec}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="label text-[#58aefc]/80">Status</label>
            <select
              className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all" className="bg-[#0b3561]">All Status</option>
              <option value="active" className="bg-[#0b3561]">Active</option>
              <option value="inactive" className="bg-[#0b3561]">Inactive</option>
            </select>
          </div>
          
          <div>
            <label className="label text-[#16C79A]/80">Sort By</label>
            <select className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]">
              <option className="bg-[#0d2c4a]">Name (A-Z)</option>
              <option className="bg-[#0d2c4a]">Name (Z-A)</option>
              <option className="bg-[#0d2c4a]">Newest First</option>
              <option className="bg-[#0d2c4a]">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] border border-[#58aefc]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#145fb8]/20 to-[#0f4989]/20 border-b border-[#58aefc]/20">
                <th className="text-left py-4 px-6 text-[#58aefc] font-medium">Doctor</th>
                <th className="text-left py-4 px-6 text-[#58aefc] font-medium">Specialization</th>
                <th className="text-left py-4 px-6 text-[#58aefc] font-medium">Contact</th>
                <th className="text-left py-4 px-6 text-[#58aefc] font-medium">Status</th>
                <th className="text-left py-4 px-6 text-[#58aefc] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor._id} className="border-b border-[#58aefc]/10 hover:bg-gradient-to-r from-[#145fb8]/10 to-[#0f4989]/10 transition-all duration-300">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#58aefc] to-[#145fb8] rounded-full flex items-center justify-center text-white font-bold">
                        {doctor.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">Dr. {doctor.name}</p>
                        <p className="text-sm text-[#58aefc]/70">ID: {doctor._id?.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#58aefc]/20 to-[#145fb8]/20 text-[#58aefc] text-sm font-medium">
                      {doctor.specialization || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-[#58aefc]/60" />
                        <span className="text-white">{doctor.email}</span>
                      </div>
                      {doctor.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaPhone className="text-[#58aefc]/60" />
                          <span className="text-white">{doctor.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doctor.isActive)}`}>
                      {doctor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewDoctor(doctor)}
                        className="p-2 text-[#58aefc] hover:bg-gradient-to-r from-[#58aefc]/20 to-[#145fb8]/20 rounded-lg transition-all duration-300"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        onClick={() => handleEditDoctor(doctor)}
                        className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-all duration-300"
                        title="Edit Doctor"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleStatusToggle(doctor._id, doctor.isActive ? 'active' : 'inactive')}
                        className={`p-2 rounded-lg transition-all duration-300 ${doctor.isActive ? 'text-yellow-500 hover:bg-yellow-500/20' : 'text-green-500 hover:bg-green-500/20'}`}
                        title={doctor.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {doctor.isActive ? <FaTimes /> : <FaCheck />}
                      </button>
                      <button 
                        onClick={() => handleDelete(doctor._id)}
                        className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                        title="Delete Doctor"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <FaUserMd className="text-5xl text-[#16C79A]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No doctors found</h3>
            <p className="text-[#16C79A]/70">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#16C79A]/20 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Add New Doctor</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#16C79A] hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label text-[#16C79A]/80">Full Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Password *</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                    required
                    minLength="6"
                  />
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Specialization *</label>
                  <select
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                    required
                  >
                    <option value="" className="bg-[#0d2c4a]">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec} className="bg-[#0d2c4a]">{spec}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                    placeholder="+252 61 123 4567"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#16C79A]/20 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Edit Doctor</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-[#16C79A] hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleUpdateDoctor} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label text-[#16C79A]/80">Full Name *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={editDoctor.name}
                    onChange={(e) => setEditDoctor({...editDoctor, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={editDoctor.email}
                    onChange={(e) => setEditDoctor({...editDoctor, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Specialization *</label>
                  <select
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={editDoctor.specialization}
                    onChange={(e) => setEditDoctor({...editDoctor, specialization: e.target.value})}
                    required
                  >
                    <option value="" className="bg-[#0d2c4a]">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec} className="bg-[#0d2c4a]">{spec}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={editDoctor.phone}
                    onChange={(e) => setEditDoctor({...editDoctor, phone: e.target.value})}
                    placeholder="+252 61 123 4567"
                  />
                </div>
                
                <div>
                  <label className="label text-[#16C79A]/80">Status</label>
                  <select
                    className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={editDoctor.status}
                    onChange={(e) => setEditDoctor({...editDoctor, status: e.target.value})}
                  >
                    <option value="active" className="bg-[#0d2c4a]">Active</option>
                    <option value="inactive" className="bg-[#0d2c4a]">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="label text-[#16C79A]/80">Available Time Slots</label>
                  <button
                    type="button"
                    onClick={addAvailableTimeSlot}
                    className="text-sm text-[#16C79A] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <FaPlus /> Add Time Slot
                  </button>
                </div>
                
                {editDoctor.availableTime.map((slot, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 p-3 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-lg border border-[#16C79A]/20">
                    <div>
                      <label className="label text-sm text-[#16C79A]/80">Day</label>
                      <select
                        className="w-full px-3 py-2 bg-[#0d2c4a] border border-[#16C79A]/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#16C79A]"
                        value={slot.day}
                        onChange={(e) => updateTimeSlot(index, 'day', e.target.value)}
                      >
                        {daysOfWeek.map(day => (
                          <option key={day} value={day} className="bg-[#0d2c4a]">{day}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="label text-sm text-[#16C79A]/80">Start Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 bg-[#0d2c4a] border border-[#16C79A]/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#16C79A]"
                        value={slot.startTime}
                        onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="label text-sm text-[#16C79A]/80">End Time</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 bg-[#0d2c4a] border border-[#16C79A]/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#16C79A]"
                          value={slot.endTime}
                          onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                        />
                      </div>
                      {editDoctor.availableTime.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAvailableTimeSlot(index)}
                          className="p-2 text-red-500 hover:text-red-300 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Update Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Doctor Modal */}
      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#16C79A]/20 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Doctor Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-[#16C79A] hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-full mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    {selectedDoctor.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-white">Dr. {selectedDoctor.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(selectedDoctor.isActive)}`}>
                    {selectedDoctor.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label text-[#16C79A]/80">Email</label>
                      <div className="px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white">{selectedDoctor.email}</div>
                    </div>
                    
                    <div>
                      <label className="label text-[#16C79A]/80">Phone</label>
                      <div className="px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white">{selectedDoctor.phone || 'N/A'}</div>
                    </div>
                    
                    <div>
                      <label className="label text-[#16C79A]/80">Specialization</label>
                      <div className="px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white">{selectedDoctor.specialization || 'N/A'}</div>
                    </div>
                    
                    <div>
                      <label className="label text-[#16C79A]/80">Doctor ID</label>
                      <div className="px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white text-sm">{selectedDoctor._id}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-[#16C79A]" /> Available Time
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedDoctor.availableTime?.map((slot, index) => (
                    <div key={index} className="bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 p-3 rounded-lg border border-[#16C79A]/20">
                      <div className="font-medium text-white">{slot.day}</div>
                      <div className="text-sm text-[#16C79A]/80">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaUserInjured className="text-[#16C79A]" /> Recent Appointments
                </h4>
                {loadingAppointments ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16C79A] mx-auto"></div>
                  </div>
                ) : doctorAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#16C79A]/20">
                          <th className="text-left py-2 px-3 text-sm font-medium text-[#16C79A]">Patient</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-[#16C79A]">Date</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-[#16C79A]">Time</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-[#16C79A]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctorAppointments.slice(0, 5).map((appointment) => (
                          <tr key={appointment._id} className="border-b border-[#16C79A]/10 hover:bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 transition-all duration-300">
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-2">
                                <FaUserInjured className="text-[#16C79A]/60" />
                                <span className="text-white">{appointment.patientId?.name}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-white">{new Date(appointment.date).toLocaleDateString()}</td>
                            <td className="py-2 px-3 text-white">{appointment.time}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                appointment.status === 'approved' ? 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-[#16C79A]/70">
                    <FaClock className="text-3xl mx-auto mb-2" />
                    <p className="text-white">No appointments found for this doctor</p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditDoctor(selectedDoctor);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <FaEdit /> Edit Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;