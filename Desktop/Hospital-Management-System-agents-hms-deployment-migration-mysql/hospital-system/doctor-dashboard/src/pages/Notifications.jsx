import React, { useState, useEffect } from 'react'
import { 
  Bell, BellOff, CheckCircle, XCircle, Calendar, Clock, 
  User, MessageSquare, Trash2, CheckCheck, Filter, 
  BellRing, AlertCircle, Info, ArrowRight, RefreshCw,
  Settings, Activity, AlertTriangle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { notificationService } from '../services/notificationService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import { toast } from 'react-toastify'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {}
      if (filter === 'unread') {
        params.unreadOnly = true
      } else if (filter === 'read') {
        params.readOnly = true
      }

      const response = await notificationService.getNotifications(params)
      
      let notificationsData = []
      if (Array.isArray(response)) {
        notificationsData = response
      } else if (response && response.data) {
        notificationsData = response.data
      } else if (response && response.notifications) {
        notificationsData = response.notifications
      } else {
        notificationsData = response || []
      }

      const formattedNotifications = notificationsData.map(notification => ({
        id: notification._id || notification.id,
        title: notification.title || 'Notification',
        message: notification.message || '',
        type: notification.type || 'system',
        isRead: notification.isRead || false,
        createdAt: new Date(notification.createdAt || notification.created_at || Date.now()),
        data: notification.data || {},
        userId: notification.userId,
        relatedId: notification.relatedId
      }))

      setNotifications(formattedNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Failed to load notifications. Please try again.')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching unread count:', error)
      const unread = notifications.filter(n => !n.isRead).length
      setUnreadCount(unread)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      toast.success('Notification marked as read')
    } catch (error) {
      console.error('Error marking as read:', error)
      toast.error('Failed to mark as read')
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      )
      
      setUnreadCount(0)
      
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to mark all as read')
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId)
      
      const notificationToDelete = notifications.find(n => n.id === notificationId)
      const wasUnread = notificationToDelete?.isRead === false
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
      
      const notificationToDelete = notifications.find(n => n.id === notificationId)
      const wasUnread = notificationToDelete?.isRead === false
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  }

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearAllNotifications()
      
      setNotifications([])
      setUnreadCount(0)
      setShowDeleteConfirm(false)
      
      toast.success('All notifications cleared')
    } catch (error) {
      console.error('Error clearing notifications:', error)
      toast.error('Failed to clear notifications')
      
      setNotifications([])
      setUnreadCount(0)
      setShowDeleteConfirm(false)
    }
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }

    if (notification.type === 'appointment' && notification.data?.appointmentId) {
      window.location.href = `/appointments?id=${notification.data.appointmentId}`
    }
    
    switch (notification.type) {
      case 'reminder':
        window.location.href = '/schedule'
        break
      case 'system':
        break
      default:
        break
    }
  }

  const refreshNotifications = () => {
    fetchNotifications()
    fetchUnreadCount()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return Calendar
      case 'reminder':
        return Clock
      case 'system':
        return Info
      default:
        return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20'
      case 'reminder':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20'
      case 'system':
        return 'bg-gradient-to-r from-purple-500/20 to-purple-600/20'
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20'
    }
  }

  const getNotificationIconColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'text-[#16C79A]'
      case 'reminder':
        return 'text-yellow-500'
      case 'system':
        return 'text-purple-500'
      default:
        return 'text-gray-500'
    }
  }

  const getNotificationActionButtons = (notification) => {
    if (notification.type === 'appointment') {
      return (
        <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/appointments?action=approve&id=${notification.data?.appointmentId}`
            }}
            className="px-3 py-1 bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A] rounded-lg text-sm hover:from-[#16C79A]/30 hover:to-[#11698E]/30 transition-all duration-300"
          >
            Approve
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/appointments?id=${notification.data?.appointmentId}`
            }}
            className="px-3 py-1 border border-[#16C79A] text-[#16C79A] rounded-lg text-sm hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300"
          >
            View Details
          </button>
        </div>
      )
    }
    return null
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-[#16C79A]/80">
            {unreadCount > 0 
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'
            }
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshNotifications}
            className="flex items-center gap-2 px-4 py-2 border border-[#16C79A]/30 text-[#16C79A] rounded-xl hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300"
            title="Refresh notifications"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          
          <div className="flex bg-gradient-to-r from-[#11698E]/20 to-[#19456B]/20 rounded-xl p-1 border border-[#16C79A]/20">
            {['all', 'unread', 'read'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white shadow-lg'
                    : 'text-[#16C79A] hover:text-white'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={notifications.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
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

      {/* Notifications List */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <BellOff className="h-16 w-16 text-[#16C79A]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white">No notifications</h3>
            <p className="text-[#16C79A]/70">
              {filter !== 'all' 
                ? `No ${filter} notifications found` 
                : 'You\'re all caught up! No notifications yet.'
              }
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300"
              >
                View All Notifications
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#16C79A]/20">
            {notifications.map(notification => {
              const Icon = getNotificationIcon(notification.type)
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 cursor-pointer transition-all duration-300 ${
                    !notification.isRead ? 'bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${getNotificationColor(notification.type)}`}>
                      <Icon className={`h-6 w-6 ${getNotificationIconColor(notification.type)}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{notification.title}</h3>
                          <p className="text-[#16C79A]/80 mt-1">{notification.message}</p>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-[#16C79A]/60">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </span>
                            
                            {!notification.isRead && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A] rounded-full text-xs">
                                <BellRing className="h-3 w-3" />
                                New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="p-1 text-[#16C79A] hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 rounded-lg transition-all duration-300"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="p-1 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      {getNotificationActionButtons(notification)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-[#16C79A]" />
          <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                <Bell className="h-5 w-5 text-[#16C79A]" />
              </div>
              <div>
                <p className="font-medium text-white">Appointment Notifications</p>
                <p className="text-sm text-[#16C79A]/80">Receive alerts for new appointments</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-[#0d2c4a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#16C79A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16C79A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-white">Reminder Notifications</p>
                <p className="text-sm text-[#16C79A]/80">Receive appointment reminders</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-[#0d2c4a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#16C79A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16C79A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20">
                <Activity className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-white">System Notifications</p>
                <p className="text-sm text-[#16C79A]/80">Receive system updates and announcements</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-[#0d2c4a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#16C79A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16C79A]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                <BellRing className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-white">Push Notifications</p>
                <p className="text-sm text-[#16C79A]/80">Receive push notifications on your device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-[#0d2c4a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#16C79A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16C79A]"></div>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300">
            Save Settings
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Clear All Notifications</h3>
              <p className="text-[#16C79A]/80">
                Are you sure you want to clear all {notifications.length} notifications? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-[#16C79A] text-[#16C79A] rounded-xl hover:bg-gradient-to-r from-[#16C79A]/10 to-[#11698E]/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={clearAllNotifications}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all duration-300"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications