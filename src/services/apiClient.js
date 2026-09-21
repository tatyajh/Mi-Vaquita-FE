import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use((config) => {
  // Si el propio llamado ya trae su Authorization (ver
  // CommunityService.getPrivateActivity/getPrivateNatillera, que usan
  // el token de invitado en vez del de sesión), no lo pisa.
  if (config.headers.Authorization) {
    return config;
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
