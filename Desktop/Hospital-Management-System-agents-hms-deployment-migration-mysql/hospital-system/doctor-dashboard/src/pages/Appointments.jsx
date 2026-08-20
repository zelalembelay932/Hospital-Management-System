import React, { useState, useEffect } from 'react'
import { Calendar, Filter, Search, Download, RefreshCw, User, Clock, AlertCircle } from 'lucide-react'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { toast } from 'react-toastify'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    sortBy: 'date_desc'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, filters, searchTerm])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await appointmentService.getDoctorAppointments()
      
      let appointmentsData = []
      if (Array.isArray(response)) {
        appointmentsData = response
      } else if (response && response.data) {
        appointmentsData = response.data
      } else if (response && response.appointments) {
        appointmentsData = response.appointments
      } else {
        appointmentsData = getMockAppointments()
      }
      
      setAppointments(appointmentsData)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setError('Failed to load appointments. Please try again.')
      setAppointments(getMockAppointments())
    } finally {
      setLoading(false)
    }
  }

  const getMockAppointments = () => {
    return [
      {
        _id: '1',
        patientId: {
          _id: 'p1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+251 994942373'
        },
        date: new Date(Date.now() + 86400000),
        time: '10:00',
        status: 'pending',
        symptoms: 'Headache and fever',
        notes: '',
        createdAt: new Date()
      },
      {
        _id: '2',
        patientId: {
          _id: 'p2',
          name: 'Sarah Johnson',
          email: 'zele@example.com',
          phone: '+251 994942373 '
        },
        date: new Date(Date.now() + 172800000),
        time: '14:00',
        status: 'approved',
        symptoms: 'Regular checkup',
        notes: 'Annual physical examination',
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        _id: '3',
        patientId: {
          _id: 'p3',
          name: 'Michael Brown',
          email: 'michael@example.com',
          phone: '+251 994942373 '
        },
        date: new Date(Date.now() + 259200000),
        time: '11:30',
        status: 'pending',
        symptoms: 'Back pain',
        notes: '',
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        _id: '4',
        patientId: {
          _id: 'p4',
          name: 'Emily Wilson',
          email: 'emily@example.com',
          phone: '+251 994942373 '
        },
        date: new Date(Date.now() - 86400000),
        time: '15:00',
        status: 'completed',
        symptoms: 'Cough and cold',
        notes: 'Prescribed medication',
        createdAt: new Date(Date.now() - 259200000)
      },
      {
        _id: '5',
        patientId: {
          _id: 'p5',
          name: 'Robert Davis',
          email: 'robert@example.com',
          phone: '+251 994942373 '
        },
        date: new Date(),
        time: '09:00',
        status: 'approved',
        symptoms: 'Dental checkup',
        notes: 'Follow-up required',
        createdAt: new Date(Date.now() - 345600000)
      }
    ]
  }

  const filterAppointments = () => {
    let filtered = [...appointments]

    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientId?.phone?.includes(searchTerm)
      )
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status)
    }

    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString()
      filtered = filtered.filter(apt =>
        new Date(apt.date).toDateString() === filterDate
      )
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)

      switch (filters.sortBy) {
        case 'date_asc':
          return dateA - dateB
        case 'date_desc':
          return dateB - dateA
        case 'name_asc':
          return a.patientId?.name?.localeCompare(b.patientId?.name)
        case 'name_desc':
          return b.patientId?.name?.localeCompare(a.patientId?.name)
        default:
          return dateB - dateA
      }
    })

    setFilteredAppointments(filtered)
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status)
      toast.success(`Appointment ${status} successfully`)
      
      setAppointments(prev =>
        prev.map(apt =>
          apt._id === id ? { ...apt, status } : apt
        )
      )
    } catch (error) {
      console.error('Error updating appointment status:', error)
      toast.error('Failed to update appointment')
    }
  }

  const exportToCSV = () => {
    if (filteredAppointments.length === 0) {
      toast.warning('No appointments to export')
      return
    }

    const headers = ['Date', 'Time', 'Patient', 'Email', 'Phone', 'Status', 'Symptoms']
    const csvData = filteredAppointments.map(apt => [
      new Date(apt.date).toLocaleDateString(),
      apt.time,
      apt.patientId?.name || 'N/A',
      apt.patientId?.email || 'N/A',
      apt.patientId?.phone || 'N/A',
      apt.status,
      apt.symptoms || 'N/A'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('Appointments exported successfully')
  }

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    switch(status) {
      case 'approved': return <span className={`${baseClasses} bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]`}>Approved</span>;
      case 'pending': return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      case 'completed': return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
      case 'cancelled': return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
      default: return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Appointments</h1>
          <p className="text-[#16C79A]/80">Manage and view all patient appointments</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-2 px-4 py-3 border border-[#16C79A]/30 text-[#16C79A] rounded-xl hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-all duration-300"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage 
            message={error} 
            type="error"
            onDismiss={() => setError(null)}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl mb-6">
        <div className="p-6 border-b border-[#16C79A]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2 text-[#16C79A]">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters</span>
              </div>
              
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#16C79A]/60" />
                  <input
                    type="text"
                    placeholder="Search by patient name, email or phone..."
                    className="w-full pl-10 pr-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#16C79A]/80 mb-2">Status</label>
              <select
                className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all" className="bg-[#0d2c4a]">All Status</option>
                <option value="pending" className="bg-[#0d2c4a]">Pending</option>
                <option value="approved" className="bg-[#0d2c4a]">Approved</option>
                <option value="completed" className="bg-[#0d2c4a]">Completed</option>
                <option value="cancelled" className="bg-[#0d2c4a]">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#16C79A]/80 mb-2">Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                value={filters.date}
                onChange={(e) => setFilters({...filters, date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#16C79A]/80 mb-2">Sort By</label>
              <select
                className="w-full px-4 py-3 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="date_desc" className="bg-[#0d2c4a]">Date (Newest First)</option>
                <option value="date_asc" className="bg-[#0d2c4a]">Date (Oldest First)</option>
                <option value="name_asc" className="bg-[#0d2c4a]">Name (A-Z)</option>
                <option value="name_desc" className="bg-[#0d2c4a]">Name (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-[#16C79A]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#16C79A]" />
              <span className="font-medium text-white">
                {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#16C79A]/80">
                Page {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#16C79A]/30 rounded-lg text-[#16C79A] disabled:opacity-50 hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-[#16C79A]/30 rounded-lg text-[#16C79A] disabled:opacity-50 hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-[#16C79A]/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white">No appointments found</h3>
              <p className="text-[#16C79A]/70">
                {searchTerm || filters.status !== 'all' || filters.date
                  ? 'Try adjusting your filters'
                  : 'No appointments scheduled yet'
                }
              </p>
              {searchTerm || filters.status !== 'all' || filters.date ? (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilters({ status: 'all', date: '', sortBy: 'date_desc' })
                  }}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Clear Filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedAppointments.map((appointment) => {
                  const isToday = new Date(appointment.date).toDateString() === new Date().toDateString();
                  
                  return (
                    <div 
                      key={appointment._id} 
                      className={`bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 p-4 rounded-xl border border-[#16C79A]/20 hover:from-[#11698E]/20 hover:to-[#19456B]/20 transition-all duration-300 ${isToday ? 'border-[#16C79A]/40' : ''}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#16C79A] to-[#11698E] rounded-full flex items-center justify-center text-white font-bold">
                            {appointment.patientId?.name?.charAt(0).toUpperCase() || 'P'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{appointment.patientId?.name}</h3>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-[#16C79A]/60" />
                                <span className="text-[#16C79A]/80">{appointment.patientId?.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-[#16C79A]/60" />
                                <span className="text-[#16C79A]/80">
                                  {formatDate(appointment.date)} at {appointment.time}
                                </span>
                              </div>
                              {isToday && (
                                <span className="px-2 py-1 bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A] text-xs rounded-full">
                                  Today
                                </span>
                              )}
                            </div>
                            {appointment.symptoms && (
                              <p className="text-sm text-[#16C79A]/70 mt-2">
                                <AlertCircle className="h-3 w-3 inline mr-1" />
                                {appointment.symptoms}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {getStatusBadge(appointment.status)}
                          
                          <div className="flex gap-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(appointment._id, 'approved')}
                                  className="px-3 py-1 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white text-sm rounded-lg hover:opacity-90 transition-all"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                  className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:opacity-90 transition-all"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {appointment.status === 'approved' && (
                              <button
                                onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-lg hover:opacity-90 transition-all"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t border-[#16C79A]/20 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-[#16C79A]/30 rounded-lg text-[#16C79A] disabled:opacity-50 hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all"
                    >
                      First
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currentPage === pageNumber
                                ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white'
                                : 'border border-[#16C79A]/30 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return <span key={index} className="px-2 text-[#16C79A]">...</span>
                      }
                      return null
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-[#16C79A]/30 rounded-lg text-[#16C79A] disabled:opacity-50 hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all"
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointments