// src/services/FriendsService.js
import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_API_URL}/friends`;

export const getFriends = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los amigos:', error);
    throw error;
  }
};

export const addFriend = async (friendData) => {
  try {
    const response = await axios.post(`${baseUrl}/addFriend`, friendData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el amigo:', error);
    throw error;
  }
};

export const deleteFriend = async (friendUserId) => {
  try {
    const response = await axios.delete(`${baseUrl}/deleteFriend/${friendUserId}`);
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
