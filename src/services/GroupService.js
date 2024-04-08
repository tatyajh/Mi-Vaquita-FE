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

const deleteGroup = async (id) => {
  console.log('id eliminado', id)
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data; 
};

const updateGroup = async (id, groupData) => {
  console.log('id a actualizar', id)
  try {
    console.log(`Actualizando grupo con ID ${id} y datos`, groupData); 
    const response = await axios.put(`${baseUrl}/${id}`, groupData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el grupo con ID ${id}:`, error);
    throw error; 
  }
};



const GroupService = {
  createGroup,
  deleteGroup,
  updateGroup
};

export default GroupService;
