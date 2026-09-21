export const formatDateCO = (value, options = {}) => {
  if (!value) return '';
  const raw = String(value).slice(0, 10);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T12:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric', month: 'short', year: 'numeric', ...options,
  }).format(date);
};
