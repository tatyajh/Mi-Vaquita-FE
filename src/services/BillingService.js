import apiClient from './apiClient';

export const createCheckoutSession = async () => {
  const response = await apiClient.post('/billing/checkout');
  return response.data;
};

export const getBillingStatus = async () => {
  const response = await apiClient.get('/billing/status');
  return response.data;
};

const billingService = { createCheckoutSession, getBillingStatus };

export default billingService;
