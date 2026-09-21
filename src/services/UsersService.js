import apiClient from './apiClient';
import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_API_URL}`;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, { email, password }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const register = async (name, email, phone, password) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, { name, email, phone, password });
    return response.data;
  } catch (error) {
    console.error("Error al registrarse:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  const response = await apiClient.get('/users/by-email', { params: { email } });
  return response.data;
};

export const searchUsers = async (query) => {
  // El backend requiere el JWT para excluir al usuario logueado de sus
  // propios resultados de búsqueda; apiClient lo adjunta automáticamente.
  const response = await apiClient.get('/users/search', {
    params: { q: query },
  });
  return response.data;
};

export const getLoggedInUser = async () => {
  try {
    const response = await apiClient.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario logueado:', error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${baseUrl}/auth/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await axios.post(`${baseUrl}/auth/reset-password`, { token, password });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.put('/users/me/password', { currentPassword, newPassword });
  return response.data;
};

export const deactivateAccount = async () => {
  const response = await apiClient.delete('/users/me');
  return response.data;
};

const usersService = {
  login,
  register,
  getAllUsers,
  getUserByEmail,
  searchUsers,
  getLoggedInUser,
  forgotPassword,
  resetPassword,
  changePassword,
  deactivateAccount,
};

export default usersService;
