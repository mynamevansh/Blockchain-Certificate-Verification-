import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../constants';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      title: 'Certificate Uploaded',
      message: 'Your certificate has been successfully uploaded to the blockchain.',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'info',
      title: 'System Update',
      message: 'The system has been updated with new security features.',
      timestamp: new Date(Date.now() - 60000).toISOString(),
    }
  ]);

  useEffect(() => {
    const socketInstance = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      console.log('✅ WebSocket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...notification
        },
        ...prev
      ]);

      // Show toast for new notification
      if (notification.type === 'success') {
        toast.success(notification.title || 'Success');
      } else if (notification.type === 'error') {
        toast.error(notification.title || 'Error');
      } else {
        toast.info(notification.title || 'Info');
      }
    });

    setSocket(socketInstance);

    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      socketInstance.disconnect();
    };
  }, []);

  const emitEvent = (eventName, data) => {
    if (socket && isConnected) {
      socket.emit(eventName, data);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const value = {
    socket,
    isConnected,
    notifications,
    emitEvent,
    clearNotifications,
    removeNotification
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};