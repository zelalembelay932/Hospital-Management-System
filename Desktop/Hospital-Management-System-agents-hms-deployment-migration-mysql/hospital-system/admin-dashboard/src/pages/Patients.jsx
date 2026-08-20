import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/admin/patients');
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to load patients');
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/patients/${patientId}`);
      toast.success('Patient deleted successfully');
      fetchPatients();
    } catch (error) {
      toast.error('Failed to delete patient');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone?.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16C79A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Patients Management</h1>
        <p className="text-[#16C79A]/80 mt-2">Manage and monitor all patient records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#16C79A] to-[#11698E] text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Total Patients</p>
              <h3 className="text-2xl font-bold mt-2">{patients.length}</h3>
            </div>
            <FaUser className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Active Today</p>
              <h3 className="text-2xl font-bold mt-2">
                {patients.filter(p => {
                  const today = new Date().toISOString().split('T')[0];
                  return p.lastLogin && p.lastLogin.split('T')[0] === today;
                }).length}
              </h3>
            </div>
            <FaCalendarAlt className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">New This Month</p>
              <h3 className="text-2xl font-bold mt-2">
                {patients.filter(p => {
                  const month = new Date().getMonth();
                  const year = new Date().getFullYear();
                  const patientDate = new Date(p.createdAt);
                  return patientDate.getMonth() === month && patientDate.getFullYear() === year;
                }).length}
              </h3>
            </div>
            <FaUser className="text-3xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Appointments</p>
              <h3 className="text-2xl font-bold mt-2">
                {patients.reduce((acc, patient) => acc + (patient.appointmentCount || 0), 0)}
              </h3>
            </div>
            <FaCalendarAlt className="text-3xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label text-[#16C79A]/80">Search Patients</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#16C79A]/60" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
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
                <option value="active" className="bg-[#0d2c4a]">Active</option>
                <option value="inactive" className="bg-[#0d2c4a]">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label text-[#16C79A]/80">Sort By</label>
            <select className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]">
              <option className="bg-[#0d2c4a]">Newest First</option>
              <option className="bg-[#0d2c4a]">Oldest First</option>
              <option className="bg-[#0d2c4a]">Name (A-Z)</option>
              <option className="bg-[#0d2c4a]">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 border-b border-[#16C79A]/20">
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Patient</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Contact</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Account Info</th>
                <th className="text-left py-4 px-6 text-[#16C79A] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient._id} className="border-b border-[#16C79A]/10 hover:bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 transition-all duration-300">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-full flex items-center justify-center text-white font-bold">
                        {patient.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{patient.name}</p>
                        <p className="text-sm text-[#16C79A]/70">ID: {patient._id?.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-[#16C79A]/60 text-sm" />
                        <span className="text-sm text-white">{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-[#16C79A]/60 text-sm" />
                        <span className="text-sm text-white">{patient.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-[#16C79A]/80">Created: </span>
                        <span className="font-medium text-white">{formatDate(patient.createdAt)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-[#16C79A]/80">Status: </span>
                        <span className="px-2 py-1 rounded-full bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A] text-xs font-medium">Active</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 rounded-lg transition-all duration-300">
                        <FaEye />
                      </button>
                      <button className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-all duration-300">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-300"
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

        {currentPatients.length === 0 && (
          <div className="text-center py-12">
            <FaUser className="text-5xl text-[#16C79A]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No patients found</h3>
            <p className="text-[#16C79A]/70">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        {filteredPatients.length > patientsPerPage && (
          <div className="mt-6 pt-6 border-t border-[#16C79A]/20 px-6 pb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-[#16C79A]/80">
                Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, filteredPatients.length)} of {filteredPatients.length} patients
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#16C79A]/30 rounded-lg text-[#16C79A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 border rounded-lg transition-all ${
                      currentPage === number 
                        ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white border-transparent' 
                        : 'border-[#16C79A]/30 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-[#16C79A]/30 rounded-lg text-[#16C79A] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;