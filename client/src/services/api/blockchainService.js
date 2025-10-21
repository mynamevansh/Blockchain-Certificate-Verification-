import api from '../apiClient';

export const blockchainAPI = {
  getNetworkStatus: async () => {
    return await api.get('/blockchain/status');
  },

  getTransaction: async (txHash) => {
    return await api.get(`/blockchain/transaction/${txHash}`);
  },

  getGasEstimate: async (operation, data = {}) => {
    return await api.post('/blockchain/gas-estimate', {
      operation,
      data,
    });
  },

  getBlock: async (blockNumber) => {
    return await api.get(`/blockchain/block/${blockNumber}`);
  },

  getEvents: async (options = {}) => {
    const { fromBlock, toBlock, eventType, address } = options;
    return await api.get('/blockchain/events', {
      params: { fromBlock, toBlock, eventType, address },
    });
  },
};

export default blockchainAPI;
