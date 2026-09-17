import axios from 'axios';

const baseUrl = `${process.env.REACT_APP_API_URL}/expenses`;

export const getExpensesByGroup = async (groupId) => {
  try {
    const response = await axios.get(`${baseUrl}/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los gastos:', error);
    throw error;
  }
};

export const getGroupBalances = async (groupId) => {
  try {
    const response = await axios.get(`${baseUrl}/group/${groupId}/balances`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los balances:', error);
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(baseUrl, expenseData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el gasto:', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el gasto:', error);
    throw error;
  }
};

const ExpensesService = {
  getExpensesByGroup,
  getGroupBalances,
  createExpense,
  deleteExpense,
};

export default ExpensesService;
