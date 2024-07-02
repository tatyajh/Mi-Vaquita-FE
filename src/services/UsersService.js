import axios from "axios";

const baseUrl = `${process.env.REACT_APP_API_URL}/auth`;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(`${baseUrl.replace('/auth', '/users')}`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Error al registrarse:", error);
    throw error;
  }
};

const usersService = {
  login,
  register,
};

export default usersService;
