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
};
