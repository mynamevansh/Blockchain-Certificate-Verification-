// Alternative approach - AuthContext without useNavigate (EXAMPLE ONLY)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotification } from '../hooks/useNotification';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // ... other state and functions ...

  // Alternative logout that accepts navigate function as parameter
  const logout = useCallback(async (navigate) => {
    try {
      authAPI.logout();
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      setError(null);
      if (!userPreferences.rememberMe) {
        setUserPreferences(prev => ({ ...prev, rememberMe: false }));
      }
      showSuccess('Successfully logged out');
      // Use passed navigate function
      if (navigate) {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Failed to logout:', error);
      showError('Failed to logout properly');
      if (navigate) {
        navigate('/auth');
      }
    }
  }, [userPreferences.rememberMe, setUserPreferences, showSuccess, showError]);

  // ... rest of the context
};

// Usage in components:
// const { logout } = useAuth();
// const navigate = useNavigate();
// const handleLogout = () => logout(navigate);