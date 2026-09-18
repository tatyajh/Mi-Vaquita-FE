// src/services/FriendsService.js
import apiClient from './apiClient';

const baseUrl = '/friends';

export const getFriends = async () => {
  try {
    const response = await apiClient.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los amigos:', error);
    throw error;
  }
};

export const addFriend = async (friendData) => {
  try {
    const response = await apiClient.post(`${baseUrl}/addFriend`, friendData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el amigo:', error);
    throw error;
  }
};

export const deleteFriend = async (friendUserId) => {
  try {
    const response = await apiClient.delete(`${baseUrl}/deleteFriend/${friendUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el amigo:', error);
    throw error;
  }
};

const FriendsService = {
  getFriends,
  addFriend,
  deleteFriend,
};

export default FriendsService;
