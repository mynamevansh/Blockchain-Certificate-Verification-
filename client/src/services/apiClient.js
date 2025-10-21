import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '../constants';

export class APIError extends Error {
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
  timeout: 30000,
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

export const createFormData = (data) => {
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

export default api;
