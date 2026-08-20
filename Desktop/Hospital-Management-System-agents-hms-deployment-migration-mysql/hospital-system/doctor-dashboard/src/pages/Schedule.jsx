import React, { useState, useEffect } from 'react'
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Plus, Edit, CalendarDays, Activity } from 'lucide-react'
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns'
import { appointmentService } from '../services/appointmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-toastify'

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('day')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  useEffect(() => {
    fetchAppointments()
  }, [currentDate, viewMode])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const data = await appointmentService.getDoctorAppointments()
      setAppointments(data.data || [])
    } catch (error) {
      toast.error('Failed to fetch schedule')
    } finally {
      setLoading(false)
    }
  }

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    ).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getWeekDates = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    const end = endOfWeek(currentDate, { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return [
      `${hour}:00`,
      `${hour}:30`
    ]
  }).flat()

  const getAppointmentColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 border-[#16C79A]/30'
      case 'pending': return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
      case 'completed': return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/30'
      default: return 'bg-gradient-to-r from-gray-500/10 to-gray-600/10 border-gray-500/20'
    }
  }

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate)

    return (
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-[#16C79A]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-[#16C79A]" />
              <h2 className="text-xl font-bold text-white">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subDays(currentDate, 1))}
                className="p-2 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-xl transition-all duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addDays(currentDate, 1))}
                className="p-2 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-xl transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-24 gap-2">
            {/* Time column */}
            <div className="col-span-1">
              {timeSlots.map(time => (
                <div key={time} className="h-12 border-b border-[#16C79A]/20 flex items-center justify-end pr-2">
                  <span className="text-xs text-[#16C79A]/80">{time}</span>
                </div>
              ))}
            </div>

            {/* Schedule column */}
            <div className="col-span-23 relative">
              {timeSlots.map(time => (
                <div key={time} className="h-12 border-b border-[#16C79A]/20"></div>
              ))}

              {/* Appointment blocks */}
              {dayAppointments.map(appointment => {
                const [hours, minutes] = appointment.time.split(':')
                const startHour = parseInt(hours) + (parseInt(minutes) / 60)
                const topPosition = startHour * 48 // 48px per hour (24px per 30min)

                return (
                  <div
                    key={appointment._id}
                    className="absolute left-0 right-0 rounded-xl border shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                    style={{
                      top: `${topPosition}px`,
                      height: '96px', // 2 hours
                    }}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className={`h-full rounded-xl p-3 ${getAppointmentColor(appointment.status)}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm text-white">{appointment.patientId?.name}</p>
                          <p className="text-xs text-[#16C79A]/80">{appointment.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'approved' ? 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      {appointment.symptoms && (
                        <p className="text-xs mt-2 text-[#16C79A]/70 line-clamp-1">{appointment.symptoms}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-[#16C79A] to-[#11698E] rounded"></div>
              <span className="text-sm text-white">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded"></div>
              <span className="text-sm text-white">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded"></div>
              <span className="text-sm text-white">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-gray-500/30 to-gray-600/30 rounded"></div>
              <span className="text-sm text-white">Available Slot</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDates = getWeekDates()

    return (
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl">
        <div className="p-6 border-b border-[#16C79A]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-[#16C79A]" />
              <h2 className="text-xl font-bold text-white">
                Week {format(currentDate, 'w')} of {format(currentDate, 'yyyy')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentDate(subDays(currentDate, 7))}
                className="p-2 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-xl transition-all duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300"
              >
                This Week
              </button>
              <button
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
                className="p-2 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-xl transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Weekday headers */}
            <div className="grid grid-cols-8 border-b border-[#16C79A]/20">
              <div className="p-4 border-r border-[#16C79A]/20 font-medium text-white bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20">Time</div>
              {weekDates.map(date => (
                <div key={date.toString()} className="p-4 text-center border-r border-[#16C79A]/20 bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20">
                  <p className="font-medium text-white">{format(date, 'EEE')}</p>
                  <p className="text-sm text-[#16C79A]/80">{format(date, 'd')}</p>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
              <div key={time} className="grid grid-cols-8 border-b border-[#16C79A]/10">
                <div className="p-4 border-r border-[#16C79A]/10 text-sm text-[#16C79A]/80 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10">{time}</div>
                {weekDates.map(date => {
                  const dayAppointments = getAppointmentsForDate(date)
                  const appointment = dayAppointments.find(apt => apt.time === time)
                  
                  return (
                    <div key={date.toString()} className="p-4 border-r border-[#16C79A]/10 min-h-[80px] bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10">
                      {appointment ? (
                        <div
                          className={`p-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            appointment.status === 'approved' ? getAppointmentColor('approved') :
                            appointment.status === 'pending' ? getAppointmentColor('pending') :
                            getAppointmentColor('completed')
                          }`}
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <p className="font-medium text-white truncate">{appointment.patientId?.name}</p>
                          <p className="text-xs text-[#16C79A]/80">{appointment.time}</p>
                          <span className="text-xs px-2 py-1 mt-1 rounded-full bg-white/20 text-white">
                            {appointment.status}
                          </span>
                        </div>
                      ) : (
                        <div className="text-center text-[#16C79A]/50 text-sm py-6">
                          Available
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const AppointmentModal = ({ appointment, onClose }) => {
    if (!appointment) return null

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-[#16C79A]" />
                <h3 className="text-lg font-bold text-white">Appointment Details</h3>
              </div>
              <button onClick={onClose} className="text-[#16C79A] hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 p-3 rounded-xl">
                  <User className="h-5 w-5 text-[#16C79A]" />
                </div>
                <div>
                  <p className="font-semibold text-white">{appointment.patientId?.name}</p>
                  <p className="text-sm text-[#16C79A]/80">{appointment.patientId?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 p-3 rounded-xl">
                  <p className="text-sm text-[#16C79A]/80">Date & Time</p>
                  <p className="font-medium text-white">
                    {format(new Date(appointment.date), 'MMM d, yyyy')} at {appointment.time}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 p-3 rounded-xl">
                  <p className="text-sm text-[#16C79A]/80">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'approved' ? 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>

              {appointment.symptoms && (
                <div className="bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 p-3 rounded-xl">
                  <p className="text-sm text-[#16C79A]/80">Symptoms</p>
                  <p className="font-medium text-white">{appointment.symptoms}</p>
                </div>
              )}

              {appointment.notes && (
                <div className="bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 p-3 rounded-xl">
                  <p className="text-sm text-[#16C79A]/80">Doctor Notes</p>
                  <p className="font-medium text-white">{appointment.notes}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 p-3 rounded-xl">
                <p className="text-sm text-[#16C79A]/80">Contact</p>
                <p className="font-medium text-white">{appointment.patientId?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  window.location.href = `/appointments?id=${appointment._id}`
                }}
                className="flex-1 px-4 py-3 border border-[#16C79A] text-[#16C79A] rounded-xl hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300"
              >
                View Full Details
              </button>
              {appointment.status === 'pending' && (
                <button
                  onClick={() => {
                    appointmentService.updateAppointmentStatus(appointment._id, 'approved')
                    onClose()
                    fetchAppointments()
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Schedule</h1>
          <p className="text-[#16C79A]/80">View and manage your appointment schedule</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 rounded-xl p-1 border border-[#16C79A]/20">
            {['day', 'week'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-xl capitalize transition-all duration-300 ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white shadow-lg'
                    : 'text-[#16C79A] hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.location.href = '/availability'}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            Set Availability
          </button>
        </div>
      </div>

      {viewMode === 'day' ? renderDayView() : renderWeekView()}

      {/* Appointment Modal */}
      <AppointmentModal 
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-[#16C79A]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {appointments.filter(a => a.status === 'approved').length}
              </p>
              <p className="text-[#16C79A]/80">Approved Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-[#16C79A]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {getAppointmentsForDate(new Date()).length}
              </p>
              <p className="text-[#16C79A]/80">Today's Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 p-3 rounded-xl">
              <Activity className="h-6 w-6 text-[#16C79A]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-[#16C79A]/80">Pending Approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule