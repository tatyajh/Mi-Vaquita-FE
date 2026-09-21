import apiClient from './apiClient';

const root = '/community';
const data = (response) => response.data;

export const listActivities = () => apiClient.get(`${root}/activities`).then(data);
export const createGuest = (body) => apiClient.post(`${root}/guests`, body).then(data);
export const createActivity = (body) => apiClient.post(`${root}/activities`, body).then(data);
export const getActivity = (id) => apiClient.get(`${root}/activities/${id}`).then(data);
export const getPrivateActivity = (id) => apiClient.get(`${root}/activities/${id}/private`).then(data);
export const getPrivateNatillera = (id) => apiClient.get(`${root}/natilleras/${id}/private`).then(data);
export const inviteGuest = (id, participantId) => apiClient.post(`${root}/activities/${id}/invitations`, { participantId }).then(data);
export const setExclusions = (id, participantId, excludedParticipantIds) => apiClient.put(`${root}/activities/${id}/exclusions`, { participantId, excludedParticipantIds }).then(data);
export const setNumbers = (id, assignments) => apiClient.put(`${root}/activities/${id}/numbers`, { assignments }).then(data);
export const drawActivity = (id) => apiClient.post(`${root}/activities/${id}/draw`).then(data);
export const retryNotifications = (id) => apiClient.post(`${root}/activities/${id}/notifications/retry`).then(data);
export const completeActivity = (id) => apiClient.post(`${root}/activities/${id}/complete`).then(data);
export const addTransaction = (id, body) => apiClient.post(`${root}/activities/${id}/transactions`, body).then(data);
export const addProduct = (id, body) => apiClient.post(`${root}/activities/${id}/products`, body).then(data);
export const addInventoryMovement = (id, productId, body) => apiClient.post(`${root}/activities/${id}/products/${productId}/movements`, body).then(data);
export const reconcileActivity = (id) => apiClient.post(`${root}/activities/${id}/reconcile`).then(data);
export const inviteNatilleraGuest = (id, participantId) => apiClient.post(`${root}/natilleras/${id}/invitations`, { participantId }).then(data);
export const addNatilleraQuota = (id, body) => apiClient.post(`${root}/natilleras/${id}/quotas`, body).then(data);
export const addNatilleraContribution = (id, body) => apiClient.post(`${root}/natilleras/${id}/contributions`, body).then(data);
export const addNatilleraLedger = (id, body) => apiClient.post(`${root}/natilleras/${id}/ledger`, body).then(data);
export const claimInvitation = (token, pin) => apiClient.post(`${root}/invitations/claim`, { token, pin }).then(data);
export const accessInvitation = (token, pin) => apiClient.post(`${root}/invitations/access`, { token, pin }).then(data);
