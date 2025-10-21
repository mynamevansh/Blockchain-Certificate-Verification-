import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '../constants';
class APIError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.metadata = { startTime: Date.now() };
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(new APIError(
      ERROR_MESSAGES.NETWORK_ERROR,
      0,
      'REQUEST_FAILED',
      error
    ));
  }
);
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development' && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }
    return response.data;
  },
  (error) => {
    const { response, request, message } = error;
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: response?.status,
        message: response?.data?.message || message,
        data: response?.data,
      });
    }
    if (response) {
      const { status, data } = response;
      switch (status) {
        case 401:
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.dispatchEvent(new Event('auth:logout'));
          throw new APIError(
            ERROR_MESSAGES.UNAUTHORIZED,
            status,
            'UNAUTHORIZED',
            data
          );
        case 403:
          throw new APIError(
            data?.message || 'Access forbidden',
            status,
            'FORBIDDEN',
            data
          );
        case 404:
          throw new APIError(
            data?.message || 'Resource not found',
            status,
            'NOT_FOUND',
            data
          );
        case 422:
          throw new APIError(
            data?.message || 'Validation error',
            status,
            'VALIDATION_ERROR',
            data?.errors || data
          );
        case 429:
          throw new APIError(
            'Too many requests. Please try again later.',
            status,
            'RATE_LIMIT',
            data
          );
        case 500:
          throw new APIError(
            'Internal server error. Please try again later.',
            status,
            'SERVER_ERROR',
            data
          );
        default:
          throw new APIError(
            data?.message || `HTTP ${status} Error`,
            status,
            'HTTP_ERROR',
            data
          );
      }
    } else if (request) {
      throw new APIError(
        ERROR_MESSAGES.NETWORK_ERROR,
        0,
        'NETWORK_ERROR',
        { message }
      );
    } else {
      throw new APIError(
        message || 'An unexpected error occurred',
        0,
        'UNKNOWN_ERROR',
        { message }
      );
    }
  }
);
const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
export const certificateAPI = {
  upload: async (certificateData) => {
    try {
      const formData = createFormData(certificateData);
      return await api.post('/certificates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Extended timeout for file uploads
      });
    } catch (error) {
      console.error('Certificate upload failed:', error);
      throw error;
    }
  },
  verify: async (fileData) => {
    try {
      const formData = createFormData({ file: fileData });
      return await api.post('/certificates/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
    } catch (error) {
      console.error('Certificate verification failed:', error);
      throw error;
    }
  },
  revoke: async (certificateId, reason, signature) => {
    try {
      return await api.post(`/certificates/${certificateId}/revoke`, {
        reason,
        signature,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Certificate revocation failed:', error);
      throw error;
    }
  },
  getById: async (certificateId) => {
    try {
      return await api.get(`/certificates/${certificateId}`);
    } catch (error) {
      console.error(`Failed to fetch certificate ${certificateId}:`, error);
      throw error;
    }
  },
  getByIssuer: async (issuerAddress, options = {}) => {
    try {
      const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      return await api.get('/certificates/issuer', {
        params: {
          issuerAddress,
          page,
          limit,
          status,
          sortBy,
          sortOrder,
        },
      });
    } catch (error) {
      console.error('Failed to fetch certificates by issuer:', error);
      throw error;
    }
  },
  search: async (query, filters = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        issuer,
        dateFrom,
        dateTo,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;
      return await api.get('/certificates/search', {
        params: {
          q: query,
          page,
          limit,
          status,
          issuer,
          dateFrom,
          dateTo,
          sortBy,
          sortOrder,
        },
      });
    } catch (error) {
      console.error('Certificate search failed:', error);
      throw error;
    }
  },
  getStats: async (timeRange = '30d') => {
    try {
      return await api.get('/certificates/stats', {
        params: { timeRange },
      });
    } catch (error) {
      console.error('Failed to fetch certificate stats:', error);
      throw error;
    }
  },
  batchVerify: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      return await api.post('/certificates/batch-verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // Extended timeout for batch operations
      });
    } catch (error) {
      console.error('Batch verification failed:', error);
      throw error;
    }
  },
};
export const authAPI = {
  adminLogin: async (email, password) => {
    try {
      const response = await api.post('/admin/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error('Admin login failed:', error);
      throw error;
    }
  },
  userLogin: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      return response;
    } catch (error) {
      console.error('User login failed:', error);
      throw error;
    }
  },
  adminRegister: async (userData) => {
    try {
      return await api.post('/admin/register', userData);
    } catch (error) {
      console.error('Admin registration failed:', error);
      throw error;
    }
  },
  userRegister: async (userData) => {
    try {
      return await api.post('/users/register', userData);
    } catch (error) {
      console.error('User registration failed:', error);
      throw error;
    }
  },
  getAdminProfile: async () => {
    try {
      return await api.get('/admin/profile');
    } catch (error) {
      console.error('Failed to fetch admin profile:', error);
      throw error;
    }
  },
  getUserProfile: async () => {
    try {
      return await api.get('/users/profile');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user_data');
    window.dispatchEvent(new Event('auth:logout'));
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
  getCurrentUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
  getUserType: () => {
    return localStorage.getItem('userType');
  },
};
export const userAPI = {
  getProfile: async () => {
    try {
      return await authAPI.getUserProfile();
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },
  updateProfile: async (userData) => {
    try {
      return await api.put('/users/profile', userData);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  },
  getActivity: async (options = {}) => {
    try {
      const { page = 1, limit = 10, type, dateFrom, dateTo } = options;
      return await api.get('/users/activity', {
        params: { page, limit, type, dateFrom, dateTo },
      });
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
      throw error;
    }
  },
  getNotifications: async (options = {}) => {
    try {
      const { page = 1, limit = 10, unreadOnly = false } = options;
      return await api.get('/users/notifications', {
        params: { page, limit, unreadOnly },
      });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }
  },
  markNotificationsRead: async (notificationIds) => {
    try {
      return await api.post('/users/notifications/read', {
        notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds],
      });
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      throw error;
    }
  },
};
export const blockchainAPI = {
  getNetworkStatus: async () => {
    try {
      return await api.get('/blockchain/status');
    } catch (error) {
      console.error('Failed to fetch network status:', error);
      throw error;
    }
  },
  getTransaction: async (txHash) => {
    try {
      return await api.get(`/blockchain/transaction/${txHash}`);
    } catch (error) {
      console.error(`Failed to fetch transaction ${txHash}:`, error);
      throw error;
    }
  },
  getGasEstimate: async (operation, data = {}) => {
    try {
      return await api.post('/blockchain/gas-estimate', {
        operation,
        data,
      });
    } catch (error) {
      console.error('Failed to get gas estimate:', error);
      throw error;
    }
  },
  getBlock: async (blockNumber) => {
    try {
      return await api.get(`/blockchain/block/${blockNumber}`);
    } catch (error) {
      console.error(`Failed to fetch block ${blockNumber}:`, error);
      throw error;
    }
  },
  getEvents: async (options = {}) => {
    try {
      const { fromBlock, toBlock, eventType, address } = options;
      return await api.get('/blockchain/events', {
        params: { fromBlock, toBlock, eventType, address },
      });
    } catch (error) {
      console.error('Failed to fetch blockchain events:', error);
      throw error;
    }
  },
};
export const healthAPI = {
  check: async () => {
    try {
      return await api.get('/health');
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};
export const statsAPI = {
  getDashboardStats: async (timeRange = '30d') => {
    try {
      const stats = await certificateAPI.getStats(timeRange);
      return {
        data: {
          totalCertificates: stats.total || 0,
          activeCertificates: stats.active || 0,
          revokedCertificates: stats.revoked || 0,
          pendingVerifications: stats.pending || 0,
          monthlyGrowth: stats.growth || 0,
          totalUsers: stats.users || 0,
          totalVerifications: stats.verifications || 0,
        }
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      return {
        data: {
          totalCertificates: 0,
          activeCertificates: 0,
          revokedCertificates: 0,
          pendingVerifications: 0,
          monthlyGrowth: 0,
          totalUsers: 0,
          totalVerifications: 0,
        }
      };
    }
  },
  getAnalytics: async (timeRange = '30d', granularity = 'day') => {
    try {
      return await api.get('/analytics', {
        params: { timeRange, granularity },
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  },
  getMetrics: async () => {
    try {
      return await api.get('/metrics');
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      throw error;
    }
  },
};
export { APIError };
export default api;
