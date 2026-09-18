import apiClient from './apiClient';

const baseUrl = '/groups';

export const getGroups = async (userId) => {
  try {
    const response = await apiClient.get(baseUrl, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los grupos:', error);
    throw error;
  }
};

export const getGroupById = async (id) => {
  try {
    const response = await apiClient.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el grupo con ID ${id}:`, error);
    throw error;
  }
};

export const createGroup = async (groupData) => {
  try {
    const response = await apiClient.post(baseUrl, groupData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el grupo:', error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    const response = await apiClient.delete(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el grupo con ID ${id}:`, error);
    throw error;
  }
};

export const updateGroup = async (id, groupData) => {
  try {
    const response = await apiClient.put(`${baseUrl}/${id}`, groupData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el grupo con ID ${id}:`, error);
    throw error;
  }
};

export const addGroupParticipants = async (groupId, participantIds) => {
  try {
    await apiClient.post(`${baseUrl}/participants`, { groupId, participantIds });
    return getGroupParticipants(groupId);
  } catch (error) {
    console.error('Error al agregar participantes:', error);
    throw error;
  }
};

export const getGroupParticipants = async (groupId) => {
  try {
    const response = await apiClient.get(`${baseUrl}/participants/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los participantes del grupo:', error);
    throw error;
  }
};

const GroupService = {
  getGroups,
  getGroupById,
  createGroup,
  deleteGroup,
  updateGroup,
  addGroupParticipants,
  getGroupParticipants,
};

export default GroupService;
