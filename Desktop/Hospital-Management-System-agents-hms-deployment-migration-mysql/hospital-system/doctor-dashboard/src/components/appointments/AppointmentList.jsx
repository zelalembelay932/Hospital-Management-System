import React from 'react'
import { format } from 'date-fns'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  MoreVertical
} from 'lucide-react'

const AppointmentList = ({ appointments, onStatusUpdate, showActions = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'pending': return ClockIcon
      case 'cancelled': return XCircle
      case 'completed': return CheckCircle
      default: return AlertCircle
    }
  }

  return (
    <div className="space-y-3">
      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        appointments.map((appointment) => {
          const StatusIcon = getStatusIcon(appointment.status)
          
          return (
            <div
              key={appointment._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Appointment Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`h-4 w-4 ${
                            appointment.status === 'approved' ? 'text-green-600' :
                            appointment.status === 'pending' ? 'text-yellow-600' :
                            appointment.status === 'cancelled' ? 'text-red-600' :
                            'text-gray-600'
                          }`} />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                          </span>
                        </div>
                      </div>
                      
                      {/* Patient Info */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {appointment.patientId?.name || 'N/A'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{appointment.patientId?.email || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{appointment.patientId?.phone || 'N/A'}</span>
                          </div>
                          
                          {appointment.symptoms && (
                            <div className="md:col-span-1">
                              <span className="text-sm font-medium">Symptoms:</span>
                              <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                {showActions && appointment.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => onStatusUpdate?.(appointment._id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 justify-center"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onStatusUpdate?.(appointment._id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 justify-center"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default AppointmentList