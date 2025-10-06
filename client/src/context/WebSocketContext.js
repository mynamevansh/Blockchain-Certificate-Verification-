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
    // WebSocket connection disabled to prevent connection errors
    // This file exists for future backend integration
    console.log('WebSocket connection disabled - using mock data only');
    
    // Mock connection state
    setIsConnected(false);
    setSocket(null);
    
    // No actual connection attempt
    return () => {
      console.log('WebSocket cleanup (no-op)');
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