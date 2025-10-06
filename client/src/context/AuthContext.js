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
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' or 'student'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Persistent storage for user preferences
  const [userPreferences, setUserPreferences] = useLocalStorage('user_preferences', {
    rememberMe: false,
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

  // Check for existing authentication on app load
  const checkExistingAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      const storedUserType = localStorage.getItem('userType');
      const userData = localStorage.getItem('user_data');
      
      if (token && storedUserType && userData) {
        // Verify token with backend
        try {
          let profile;
          if (storedUserType === 'admin') {
            profile = await authAPI.getAdminProfile();
          } else {
            profile = await authAPI.getUserProfile();
          }
          
          setUser(JSON.parse(userData));
          setUserType(storedUserType);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear storage
          authAPI.logout();
        }
      }
    } catch (error) {
      console.error('Failed to check existing authentication:', error);
      authAPI.logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for existing auth on app load
  useEffect(() => {
    checkExistingAuth();
  }, [checkExistingAuth]);

  // Listen for auth logout events
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      setError(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Admin login
  const loginAsAdmin = useCallback(async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.adminLogin(email, password);
      
      // Extract user data from nested response
      const userData = response.data?.user || response.admin || response.user;
      setUser(userData);
      setUserType('admin');
      setIsAuthenticated(true);
      
      // Update remember me preference
      if (rememberMe) {
        setUserPreferences(prev => ({ ...prev, rememberMe: true }));
      }
      
      showSuccess('Successfully logged in as Admin');
      return response;
    } catch (error) {
      console.error('Admin login failed:', error);
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUserPreferences, showError, showSuccess]);

  // User login
  const loginAsUser = useCallback(async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.userLogin(email, password);
      
      // Extract user data from nested response
      const userData = response.data?.user || response.user;
      setUser(userData);
      setUserType('student');
      setIsAuthenticated(true);
      
      // Update remember me preference
      if (rememberMe) {
        setUserPreferences(prev => ({ ...prev, rememberMe: true }));
      }
      
      showSuccess('Successfully logged in as Student');
      return response;
    } catch (error) {
      console.error('User login failed:', error);
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUserPreferences, showError, showSuccess]);

  // Register admin
  const registerAdmin = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.adminRegister(userData);
      
      showSuccess('Admin account created successfully');
      return response;
    } catch (error) {
      console.error('Admin registration failed:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showError, showSuccess]);

  // Register user
  const registerUser = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.userRegister(userData);
      
      showSuccess('Student account created successfully');
      return response;
    } catch (error) {
      console.error('User registration failed:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [showError, showSuccess]);

  // Logout
  const logout = useCallback(async () => {
    try {
      authAPI.logout();
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      setError(null);
      
      // Clear remember me preference if not set
      if (!userPreferences.rememberMe) {
        setUserPreferences(prev => ({ ...prev, rememberMe: false }));
      }
      
      showSuccess('Successfully logged out');
    } catch (error) {
      console.error('Failed to logout:', error);
      showError('Failed to logout properly');
    }
  }, [userPreferences.rememberMe, setUserPreferences, showSuccess, showError]);

  // Update user preferences
  const updatePreferences = useCallback((newPreferences) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  }, [setUserPreferences]);

  // Get user profile
  const getProfile = useCallback(async () => {
    try {
      if (!isAuthenticated) return null;
      
      if (userType === 'admin') {
        return await authAPI.getAdminProfile();
      } else {
        return await authAPI.getUserProfile();
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }, [isAuthenticated, userType]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return userType === role;
  }, [userType]);

  const value = {
    // State
    user,
    userType,
    isAuthenticated,
    isLoading,
    error,
    userPreferences,
    
    // Actions
    loginAsAdmin,
    loginAsUser,
    registerAdmin,
    registerUser,
    logout,
    updatePreferences,
    getProfile,
    hasRole,
    checkExistingAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};