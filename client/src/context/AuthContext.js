import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { useNotification } from '../hooks/useNotification';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Persistent storage for user preferences
  const [userPreferences, setUserPreferences] = useLocalStorage('user_preferences', {
    autoConnect: false,
    theme: 'light',
    notifications: true,
  });
  
    const { showSuccess, showError } = useNotification();

  // Clear error after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check if user is already connected
  const checkExistingConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if wallet is available and connected
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          setUser({ address: accounts[0] });
          setIsConnected(true);
        }
      } else {
        setError(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      }
    } catch (error) {
      console.error('Failed to check existing connection:', error);
      setError(error.message || 'Failed to check wallet connection');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for existing connection on app load
  useEffect(() => {
    if (userPreferences.autoConnect) {
      checkExistingConnection();
    }
  }, [userPreferences.autoConnect, checkExistingConnection]);

  // Connect wallet with comprehensive error handling
  const connectWallet = useCallback(async (options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask to continue.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setUser({ address: accounts[0] });
        setIsConnected(true);
        
        // Update auto-connect preference if requested
        if (options.autoConnect) {
          setUserPreferences(prev => ({ ...prev, autoConnect: true }));
        }
        
        showSuccess(SUCCESS_MESSAGES.WALLET_CONNECTED);
        return { address: accounts[0] };
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUserPreferences, showError, showSuccess]);

  // Disconnect wallet and cleanup
  const disconnectWallet = useCallback(async () => {
    try {
      setUser(null);
      setIsConnected(false);
      setError(null);
      
      // Clear auto-connect preference
      setUserPreferences(prev => ({ ...prev, autoConnect: false }));
      
      showSuccess(SUCCESS_MESSAGES.WALLET_DISCONNECTED);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      showError('Failed to disconnect wallet properly');
    }
  }, [setUserPreferences, showSuccess, showError]);

  // Update user preferences
  const updatePreferences = useCallback((newPreferences) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  }, [setUserPreferences]);

  // Get wallet connection status with detailed info
  const getConnectionStatus = useCallback(() => {
    return {
      isConnected,
      hasWallet: typeof window !== 'undefined' && !!window.ethereum,
      isLoading,
      error,
      user,
    };
  }, [isConnected, isLoading, error, user]);

  const value = {
    // State
    user,
    isConnected,
    isLoading,
    error,
    userPreferences,
    
    // Actions
    connectWallet,
    disconnectWallet,
    updatePreferences,
    checkExistingConnection,
    getConnectionStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};