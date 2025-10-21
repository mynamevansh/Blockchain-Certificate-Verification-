import api from '../apiClient';
import { certificateAPI } from './certificateService';

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
    return await api.get('/analytics', {
      params: { timeRange, granularity },
    });
  },

  getMetrics: async () => {
    return await api.get('/metrics');
  },
};

export default statsAPI;
