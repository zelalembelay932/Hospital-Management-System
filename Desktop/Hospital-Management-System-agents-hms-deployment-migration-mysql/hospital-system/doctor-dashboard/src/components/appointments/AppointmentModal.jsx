import React from 'react'
import { X, User, Calendar, Clock, Phone, Mail, FileText } from 'lucide-react'
import { format } from 'date-fns'

const AppointmentModal = ({ appointment, onClose, onAction }) => {
  if (!appointment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Patient Info */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{appointment.patientId?.name}</h3>
                <p className="text-gray-600">Patient ID: {appointment.patientId?._id || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{appointment.patientId?.email || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{appointment.patientId?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Appointment Information</h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <span className={`h-3 w-3 rounded-full ${
                      appointment.status === 'approved' ? 'bg-green-500' :
                      appointment.status === 'pending' ? 'bg-yellow-500' :
                      appointment.status === 'cancelled' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{appointment.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-4">Medical Information</h4>
              
              {appointment.symptoms && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-800">{appointment.symptoms}</p>
                  </div>
                </div>
              )}
              
              {appointment.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Doctor's Notes</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800">{appointment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Created Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">
                  {format(new Date(appointment.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {appointment.updatedAt 
                    ? format(new Date(appointment.updatedAt), 'MMM d, yyyy h:mm a')
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => onAction?.('approve', appointment._id)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Approve Appointment
                </button>
                <button
                  onClick={() => onAction?.('cancel', appointment._id)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Cancel Appointment
                </button>
              </>
            )}
            
            {appointment.status === 'approved' && (
              <button
                onClick={() => onAction?.('complete', appointment._id)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Mark as Completed
              </button>
            )}
            
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal