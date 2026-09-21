import apiClient from './apiClient';

const data = response => response.data;
export const getCalendar = (start, end) => apiClient.get('/calendar', { params: { start, end } }).then(data);
export const updatePreferences = body => apiClient.put('/calendar/preferences', body).then(data);
export const markReminderRead = id => apiClient.post(`/calendar/reminders/${id}/read`).then(data);

const calendarService = { getCalendar, updatePreferences, markReminderRead };
export default calendarService;
