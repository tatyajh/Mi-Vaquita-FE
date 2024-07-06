import axios from "axios";

const baseUrl = `${process.env.REACT_APP_API_URL}`;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${baseUrl}/users`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Error al registrarse:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/users`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

export const getLoggedInUser = async () => {
  try {
    const response = await axios.get(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario logueado:', error);
    throw error;
  }
};


const usersService = {
  login,
  register,
  getAllUsers,
  getLoggedInUser,
};

export default usersService;
