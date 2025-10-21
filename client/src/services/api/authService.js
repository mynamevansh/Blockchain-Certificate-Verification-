import api from '../apiClient';

export const authAPI = {
  adminLogin: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    return response;
  },

  userLogin: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('userType', 'student');
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    return response;
  },

  adminRegister: async (userData) => {
    return await api.post('/admin/register', userData);
  },

  userRegister: async (userData) => {
    return await api.post('/users/register', userData);
  },

  getAdminProfile: async () => {
    return await api.get('/admin/profile');
  },

  getUserProfile: async () => {
    return await api.get('/users/profile');
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

export default authAPI;
