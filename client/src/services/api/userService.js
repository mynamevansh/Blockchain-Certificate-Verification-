import api from '../apiClient';
import { authAPI } from './authService';

export const userAPI = {
  getProfile: async () => {
    return await authAPI.getUserProfile();
  },

  updateProfile: async (userData) => {
    return await api.put('/users/profile', userData);
  },

  getActivity: async (options = {}) => {
    const { page = 1, limit = 10, type, dateFrom, dateTo } = options;
    return await api.get('/users/activity', {
      params: { page, limit, type, dateFrom, dateTo },
    });
  },

  getNotifications: async (options = {}) => {
    const { page = 1, limit = 10, unreadOnly = false } = options;
    return await api.get('/users/notifications', {
      params: { page, limit, unreadOnly },
    });
  },

  markNotificationsRead: async (notificationIds) => {
    return await api.post('/users/notifications/read', {
      notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds],
    });
  },
};

export default userAPI;
