import { useState, useEffect } from 'react'
import { appointmentService } from '../services/appointmentService'
import { toast } from 'react-toastify'

export const useAppointments = (initialParams = {}) => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState(initialParams)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  })

  useEffect(() => {
    fetchAppointments()
  }, [params])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await appointmentService.getDoctorAppointments(params)
      
      if (response.data) {
        setAppointments(response.data)
        
        // Handle pagination if available
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setAppointments(response)
      }
    } catch (error) {
      toast.error('Failed to fetch appointments')
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appointmentId, status, notes = '') => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status, notes)
      toast.success(`Appointment ${status} successfully`)
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt._id === appointmentId ? { ...apt, status } : apt
        )
      )
      
      return true
    } catch (error) {
      toast.error(`Failed to ${status} appointment`)
      return false
    }
  }

  const refresh = () => {
    fetchAppointments()
  }

  return {
    appointments,
    loading,
    pagination,
    updateStatus,
    refresh,
    setParams,
    params
  }
}