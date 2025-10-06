import React, { createContext, useContext, useState } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  // Suppress WebSocket connection errors in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        if (args[0]?.includes?.('WebSocket connection') || 
            args[0]?.includes?.('ws://localhost')) {
          return; // Suppress WebSocket errors
        }
        originalError.apply(console, args);
      };
      
      return () => {
        console.error = originalError;
      };
    }
  }, []);

  const [socket] = useState(null);
  const [isConnected] = useState(false); // Set to false since no backend
  const [notifications, setNotifications] = useState([
    // Mock notifications for demo purposes
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
    },
    {
      id: '3',
      type: 'warning',
      title: 'Maintenance Notice',
      message: 'Scheduled maintenance will occur tonight from 12:00 AM to 2:00 AM.',
      timestamp: new Date(Date.now() - 120000).toISOString(),
    }
  ]);

  // Mock functions for when backend is not available
  const connect = () => {
    console.log('WebSocket connection will be established when backend is ready');
  };

  const disconnect = () => {
    console.log('WebSocket disconnection');
  };

  const emit = (event, data) => {
    console.log('Would emit:', event, data);
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    isConnected,
    notifications,
    connect,
    disconnect,
    emit,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};