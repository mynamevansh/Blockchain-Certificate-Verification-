import api from '../apiClient';

export const healthAPI = {
  check: async () => {
    return await api.get('/health');
  },
};

export default healthAPI;
