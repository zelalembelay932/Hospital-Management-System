import api from './api'

const normalizePatient = (patient) => {
  if (!patient) return null

  return {
    ...patient,
    _id: patient._id ?? patient.id
  }
}

const normalizeAppointment = (appointment) => {
  if (!appointment) return appointment

  const patient = normalizePatient(
    appointment.patient ??
    (typeof appointment.patientId === 'object' ? appointment.patientId : null)
  )

  return {
    ...appointment,
    _id: appointment._id ?? appointment.id,
    patientId: patient,
    // The public booking form stores symptoms in `notes` in the SQL backend.
    symptoms: appointment.symptoms ?? appointment.reason ?? appointment.notes ?? ''
  }
}

const normalizeCollection = (payload) => {
  const appointments = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.appointments ?? []

  return appointments.map(normalizeAppointment)
}

export const appointmentService = {
  // Get doctor's appointments
  getDoctorAppointments: async (params = {}) => {
    const response = await api.get('/appointments/doctor', { params })
    return normalizeCollection(response.data)
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`)
    return response.data
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status, notes = '') => {
    if (id === undefined || id === null || id === '') {
      throw new Error('Appointment identifier is missing. Refresh the appointment list and try again.')
    }

    const response = await api.patch(`/appointments/${id}/status`, { status, notes })
    return normalizeAppointment(response.data.appointment ?? response.data.data ?? response.data)
  },

  // Get today's appointments
  getTodayAppointments: async () => {
    const response = await api.get('/appointments/doctor/today')
    return normalizeCollection(response.data)
  },

  // Get upcoming appointments
  getUpcomingAppointments: async () => {
    const response = await api.get('/appointments/doctor/upcoming')
    return normalizeCollection(response.data)
  }
}
