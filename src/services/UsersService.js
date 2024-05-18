import axios from "axios";

const baseUrl = `${process.env.REACT_APP_API_URL}/users`;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

const usersService = {
  login,
};

export default usersService;
