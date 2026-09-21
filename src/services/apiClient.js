import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

let refreshPromise = null;

const endSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.setItem('sessionMessage', 'Tu sesión venció. Inicia sesión nuevamente para continuar.');
  if (window.location.pathname !== '/login') window.location.assign('/login');
};

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
  async (error) => {
    const isExpiredSession = error.response?.status === 401
      && !error.config?.skipAuthRedirect
      && !error.config?._retry
      && !String(error.config?.url || '').includes('/auth/refresh')
      && Boolean(localStorage.getItem('token'));

    if (isExpiredSession) {
      error.config._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          ).finally(() => { refreshPromise = null; });
        }
        const { data } = await refreshPromise;
        localStorage.setItem('token', data.token);
        error.config.headers.Authorization = `Bearer ${data.token}`;
        return apiClient.request(error.config);
      } catch (refreshError) {
        endSession();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
