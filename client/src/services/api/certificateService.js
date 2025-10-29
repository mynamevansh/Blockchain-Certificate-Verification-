import api, { createFormData } from '../apiClient';

export const certificateAPI = {
  upload: async (certificateData) => {
    const formData = createFormData(certificateData);
    return await api.post('/api/certificates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
  },

  verify: async (fileData) => {
    const formData = createFormData({ file: fileData });
    return await api.post('/api/certificates/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
  },

  revoke: async (certificateId, reason, signature) => {
    return await api.post(`/api/certificates/${certificateId}/revoke`, {
      reason,
      signature,
      timestamp: Date.now(),
    });
  },

  getById: async (certificateId) => {
    return await api.get(`/api/certificates/${certificateId}`);
  },

  getByIssuer: async (issuerAddress, options = {}) => {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    return await api.get('/api/certificates/issuer', {
      params: {
        issuerAddress,
        page,
        limit,
        status,
        sortBy,
        sortOrder,
      },
    });
  },

  search: async (query, filters = {}) => {
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
    return await api.get('/api/certificates/search', {
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
  },

  getStats: async (timeRange = '30d') => {
    return await api.get('/api/certificates/stats', {
      params: { timeRange },
    });
  },

  batchVerify: async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    return await api.post('/api/certificates/batch-verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
    });
  },
};

export default certificateAPI;
