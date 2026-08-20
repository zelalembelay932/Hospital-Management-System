import { useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService'
import { toast } from 'react-toastify'

export const useNotifications = (initialParams = {}) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [params, setParams] = useState(initialParams)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [params])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationService.getNotifications(params)
      setNotifications(response.data || response)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
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
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      return true
    } catch (error) {
      toast.error('Failed to mark as read')
      return false
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
      return true
    } catch (error) {
      toast.error('Failed to mark all as read')
      return false
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      const notification = notifications.find(n => n._id === notificationId)
      const wasUnread = notification?.isRead === false
      
      await notificationService.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      
      toast.success('Notification deleted')
      return true
    } catch (error) {
      toast.error('Failed to delete notification')
      return false
    }
  }

  const refresh = () => {
    fetchNotifications()
    fetchUnreadCount()
  }

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    setParams,
    params
  }
}