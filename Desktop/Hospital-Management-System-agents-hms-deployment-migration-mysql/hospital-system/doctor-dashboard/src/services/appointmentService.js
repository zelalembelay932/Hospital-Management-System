import api from './api'

export const appointmentService = {
  // Get doctor's appointments
  getDoctorAppointments: async (params = {}) => {
    const response = await api.get('/appointments/doctor', { params })
    return response.data
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status, notes = '') => {
    const response = await api.patch(`/appointments/${id}/status`, { status, notes })
    return response.data
  },

  // Get today's appointments
  getTodayAppointments: async () => {
    const response = await api.get('/appointments/doctor/today')
    return response.data
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    const response = await api.get('/appointments/doctor/upcoming')
    return response.data
  }
}