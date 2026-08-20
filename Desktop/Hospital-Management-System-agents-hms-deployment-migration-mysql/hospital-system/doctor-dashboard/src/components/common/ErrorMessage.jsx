import React from 'react'
import { AlertCircle, X } from 'lucide-react'

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  onDismiss,
  showIcon = true 
}) => {
  const typeStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  }

  const iconColors = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    success: 'text-green-600'
  }

  const Icon = {
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
    success: AlertCircle
  }[type]

  return (
    <div className={`rounded-lg border p-4 ${typeStyles[type]} ${onDismiss ? 'pr-10' : ''} relative`}>
      <div className="flex items-start">
        {showIcon && Icon && (
          <Icon className={`h-5 w-5 mr-3 flex-shrink-0 mt-0.5 ${iconColors[type]}`} />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage