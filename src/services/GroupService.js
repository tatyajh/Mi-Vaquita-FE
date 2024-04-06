import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_API_URL}/groups`;

export const createGroup = async (groupData) => {
  try {
    const response = await axios.post(baseUrl, groupData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el grupo:', error);
    throw error; 
  }
};

const GroupService = {
  createGroup
};

export default GroupService;
