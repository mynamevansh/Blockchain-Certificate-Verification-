import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

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
    // Mock notifications for demo
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
    // Commented out socket connection for now to avoid errors
    // Will connect to WebSocket when backend is available
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Listen for certificate events
    newSocket.on('certificateIssued', (data) => {
      const notification = {
        id: Date.now(),
        type: 'success',
        title: 'Certificate Issued',
        message: `Certificate ${data.certificateId} has been successfully issued`,
        timestamp: new Date().toISOString()
      };
      
      setNotifications(prev => [notification, ...prev]);
      toast.success(notification.message);
    });

    newSocket.on('certificateRevoked', (data) => {
      const notification = {
        id: Date.now(),
        type: 'warning',
        title: 'Certificate Revoked',
        message: `Certificate ${data.certificateId} has been revoked`,
        timestamp: new Date().toISOString()
      };
      
      setNotifications(prev => [notification, ...prev]);
      toast.warning(notification.message);
    });

    newSocket.on('certificateVerified', (data) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        title: 'Certificate Verified',
        message: `Certificate verification completed: ${data.isValid ? 'Valid' : 'Invalid'}`,
        timestamp: new Date().toISOString()
      };
      
      setNotifications(prev => [notification, ...prev]);
      toast.info(notification.message);
    });

    // Listen for system notifications
    newSocket.on('notification', (data) => {
      const notification = {
        id: Date.now(),
        type: data.type || 'info',
        title: data.title || 'Notification',
        message: data.message,
        timestamp: new Date().toISOString()
      };
      
      setNotifications(prev => [notification, ...prev]);
      
      switch (notification.type) {
        case 'success':
          toast.success(notification.message);
          break;
        case 'error':
          toast.error(notification.message);
          break;
        case 'warning':
          toast.warning(notification.message);
          break;
        default:
          toast.info(notification.message);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
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