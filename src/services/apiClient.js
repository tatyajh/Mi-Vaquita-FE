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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isExpiredSession = error.response?.status === 401
      && !error.config?.skipAuthRedirect
      && Boolean(localStorage.getItem('token'));

    if (isExpiredSession) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.setItem('sessionMessage', 'Tu sesión venció. Inicia sesión nuevamente para continuar.');
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
