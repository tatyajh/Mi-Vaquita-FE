export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error al leer el usuario actual:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    // El cierre local debe funcionar incluso si la API no está disponible.
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
