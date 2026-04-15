import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [realtimeUpdates, setRealtimeUpdates] = useState({
    newAppointments: 0,
    appointmentUpdates: 0
  });

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      console.log('No user or token found, skipping socket connection');
      return;
    }

    const user = JSON.parse(userStr);
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

    console.log('🔌 Connecting to socket server:', socketUrl);

    // Create socket connection with authentication
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      query: {
        token: token,
        userId: user._id,
        role: user.role
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join user room based on role
      if (user && user._id) {
        newSocket.emit('join-user', user._id);
        
        if (user.role === 'doctor') {
          newSocket.emit('join-doctor', user._id);
          console.log('👨‍⚕️ Doctor joined socket room');
        }
        
        if (user.role === 'admin') {
          newSocket.emit('join-admin', user._id);
          console.log('👨‍💼 Admin joined socket room');
        }
      }
      
      // Show connection success
      toast.success('Connected to real-time updates', {
        position: "top-right",
        autoClose: 3000
      });
    });

    // NEW NOTIFICATION - Real-time notification received
    newSocket.on('new-notification', (data) => {
      console.log('📢 Real-time notification received:', data);
      
      const notification = data.notification || data;
      const isNewAppointment = notification.type === 'appointment' && 
                               notification.title?.includes('Appointment');
      
      // Add to notifications state
      setNotifications(prev => {
        const exists = prev.find(n => n._id === notification._id);
        if (exists) return prev;
        
        return [{
          ...notification,
          id: notification._id || notification.id,
          createdAt: new Date(notification.createdAt),
          isRealTime: true
        }, ...prev];
      });
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
      
      // Update real-time updates counter
      if (isNewAppointment) {
        setRealtimeUpdates(prev => ({
          ...prev,
          newAppointments: prev.newAppointments + 1
        }));
      }
      
      // Play notification sound
      playNotificationSound();
      
      // Show toast notification
      const toastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      };
      
      if (isNewAppointment && user.role === 'doctor') {
        toastOptions.onClick = () => {
          if (notification.relatedId) {
            window.location.href = `/doctor/appointments/${notification.relatedId}`;
          }
        };
      }
      
      toast.info(
        <div>
          <div className="font-semibold">{notification.title}</div>
          <div className="text-sm mt-1">{notification.message}</div>
          {isNewAppointment && user.role === 'doctor' && (
            <div className="text-xs text-blue-600 mt-2">Click to view appointment</div>
          )}
        </div>,
        toastOptions
      );
    });

    // NOTIFICATION READ - When notification is marked as read
    newSocket.on('notification-read', (data) => {
      console.log('📋 Notification marked as read:', data);
      
      setNotifications(prev => 
        prev.map(n => 
          n._id === data.notificationId ? { ...n, isRead: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    // ALL NOTIFICATIONS READ - When all notifications are marked as read
    newSocket.on('all-notifications-read', () => {
      console.log('✅ All notifications marked as read');
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
    });

    // Connection error
    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
      
      toast.error('Connection lost. Reconnecting...', {
        position: "top-right",
        autoClose: 3000
      });
    });

    // Disconnect
    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect manually
        setTimeout(() => {
          if (newSocket.disconnected) {
            newSocket.connect();
          }
        }, 1000);
      }
    });

    // Error handling
    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log('🧹 Socket disconnected on unmount');
      }
    };
  }, []);

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Send notification via socket
  const sendNotification = (userId, notification) => {
    if (socket && isConnected) {
      socket.emit('send-notification', { userId, notification });
    }
  };

  // Mark notification as read via socket
  const markNotificationRead = (notificationId) => {
    if (socket && isConnected) {
      socket.emit('mark-notification-read', { notificationId });
    }
  };

  // Get connection status
  const getConnectionStatus = () => {
    return {
      isConnected,
      socketId: socket?.id,
      connectedUsers: socket?.connectedUsers || 0
    };
  };

  const value = {
    socket,
    isConnected,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    realtimeUpdates,
    setRealtimeUpdates,
    sendNotification,
    markNotificationRead,
    getConnectionStatus,
    playNotificationSound
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};