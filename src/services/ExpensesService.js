import apiClient from './apiClient';

const baseUrl = '/expenses';

export const getExpensesByGroup = async (groupId) => {
  try {
    const response = await apiClient.get(`${baseUrl}/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los gastos:', error);
    throw error;
  }
};

export const getGroupBalances = async (groupId) => {
  try {
    const response = await apiClient.get(`${baseUrl}/group/${groupId}/balances`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los balances:', error);
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await apiClient.post(baseUrl, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el gasto:', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await apiClient.delete(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el gasto:', error);
    throw error;
  }
};

// Función Pro: descarga el CSV de gastos/saldos del grupo. responseType
// 'blob' porque el backend devuelve texto CSV, no JSON; un 403 significa
// que el usuario no tiene el plan Pro (lo maneja quien llama a esto).
export const exportGroupExpenses = async (groupId) => {
  const response = await apiClient.get(`${baseUrl}/group/${groupId}/export`, { responseType: 'blob' });
  return response.data;
};

// Best-effort: el backend puede no tener el storage de recibos
// configurado todavía (devuelve 501). En ese caso devolvemos null en
// vez de lanzar, para que crear el gasto nunca quede bloqueado por la
// foto del recibo.
export const uploadReceipt = async (file) => {
  try {
    const formData = new FormData();
    formData.append('receipt', file);
    const response = await apiClient.post(`${baseUrl}/upload-receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.url || null;
  } catch (error) {
    console.warn('La subida del recibo no está disponible, se guardará el gasto sin foto:', error);
    return null;
  }
};

const ExpensesService = {
  getExpensesByGroup,
  getGroupBalances,
  createExpense,
  deleteExpense,
  uploadReceipt,
  exportGroupExpenses,
};

export default ExpensesService;
