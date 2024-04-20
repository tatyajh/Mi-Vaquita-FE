import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_API_URL}/groups`;


export const getGroups = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;  
  } catch (error) {
    console.error('Error al obtener los grupos:', error);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await axios.post(baseUrl, groupData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el grupo:', error);
    throw error; 
  }
};

const deleteGroup = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data; 
};

const updateGroup = async (id, groupData) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, groupData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el grupo con ID ${id}:`, error);
    throw error; 
  }
};

const GroupService = {
  getGroups,
  createGroup,
  deleteGroup,
  updateGroup
};

export default GroupService;
