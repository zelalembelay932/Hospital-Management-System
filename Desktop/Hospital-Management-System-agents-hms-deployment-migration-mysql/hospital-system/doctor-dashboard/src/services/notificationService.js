import api from './api'

export const notificationService = {
  // Get user notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw error
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all')
      return response.data
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },

  // Clear all notifications
  clearAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications/clear-all')
      return response.data
    } catch (error) {
      console.error('Error clearing all notifications:', error)
      throw error
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count')
      return response.data
    } catch (error) {
      console.error('Error getting unread count:', error)
      throw error
    }
  }
}

// Real-time notification setup (WebSocket/SSE)
export const setupNotificationListener = (onNotification) => {
  // For now, we'll use polling. In production, use WebSocket or SSE
  let intervalId = null
  
  const startPolling = () => {
    intervalId = setInterval(async () => {
      try {
        const response = await notificationService.getUnreadCount()
        if (response.unreadCount > 0) {
          onNotification({
            type: 'new_notification',
            count: response.unreadCount
          })
        }
      } catch (error) {
        console.error('Error polling notifications:', error)
      }
    }, 30000) // Poll every 30 seconds
  }
  
  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
  
  return { startPolling, stopPolling }
}

export default notificationService