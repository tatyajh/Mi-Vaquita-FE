export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error al leer el usuario actual:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
