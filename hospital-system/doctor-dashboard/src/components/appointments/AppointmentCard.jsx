import React from 'react'
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'

const AppointmentCard = ({ 
  appointment, 
  onApprove, 
  onCancel,
  onViewDetails,
  showActions = true 
}) => {
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
      case 'pending': return AlertCircle
      case 'cancelled': return XCircle
      case 'completed': return CheckCircle
      default: return AlertCircle
    }
  }

  const StatusIcon = getStatusIcon(appointment.status)

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Appointment Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
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
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {appointment.patientId?.name || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600">Patient</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm truncate">
                      {appointment.patientId?.email || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {appointment.patientId?.phone || 'N/A'}
                    </span>
                  </div>
                  
                  {appointment.symptoms && (
                    <div className="md:col-span-1">
                      <span className="text-sm font-medium">Symptoms:</span>
                      <p className="text-sm text-gray-600 truncate">
                        {appointment.symptoms}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              {appointment.notes && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Notes:</p>
                  <p className="text-sm text-yellow-700">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row md:flex-col gap-2">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove?.(appointment._id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => onCancel?.(appointment._id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>
              </>
            )}
            
            <button
              onClick={() => onViewDetails?.(appointment._id)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              <MoreVertical className="h-4 w-4" />
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard