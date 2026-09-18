// Notificaciones de gastos nuevos, versión simple sin backend: se
// guarda en localStorage cuándo fue la última vez que el usuario vio
// el detalle de cada grupo, y se compara contra la fecha del gasto
// más reciente para decidir si mostrar el indicador de "novedad".
// No es tan robusto como guardarlo en el servidor (no viaja entre
// dispositivos), pero es simple y funciona bien para el caso de uso.

const keyFor = (groupId) => `mv_last_viewed_group_${groupId}`;

export const markGroupViewed = (groupId) => {
  try {
    localStorage.setItem(keyFor(groupId), String(Date.now()));
  } catch (error) {
    // localStorage puede fallar (modo privado, cuota llena); no es
    // crítico para el funcionamiento del resto de la app.
  }
};

export const hasUnseenExpenses = (groupId, expenses) => {
  if (!expenses || expenses.length === 0) return false;
  try {
    const lastViewed = Number(localStorage.getItem(keyFor(groupId)) || 0);
    const mostRecentExpense = expenses.reduce((max, e) => {
      const t = new Date(e.createdat).getTime();
      return t > max ? t : max;
    }, 0);
    return mostRecentExpense > lastViewed;
  } catch (error) {
    return false;
  }
};
