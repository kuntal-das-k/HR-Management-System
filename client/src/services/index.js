import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const employeeService = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  update: (id, data) => api.put(`/employees/${id}`, data),
  uploadAvatar: (id, formData) => api.post(`/employees/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/employees/${id}`),
  getDepartments: () => api.get('/employees/departments'),
  getStats: () => api.get('/employees/stats'),
};

export const attendanceService = {
  checkIn: () => api.post('/attendance/checkin'),
  checkOut: () => api.post('/attendance/checkout'),
  getToday: () => api.get('/attendance/today'),
  getMy: (params) => api.get('/attendance/my', { params }),
  getAll: (params) => api.get('/attendance/all', { params }),
  getStats: (params) => api.get('/attendance/stats', { params }),
  generateQR: () => api.get('/attendance/qr'),
};

export const leaveService = {
  apply: (data) => api.post('/leave', data),
  getMy: (params) => api.get('/leave/my', { params }),
  getAll: (params) => api.get('/leave', { params }),
  updateStatus: (id, data) => api.put(`/leave/${id}`, data),
  cancel: (id) => api.delete(`/leave/${id}`),
  getBalance: (params) => api.get('/leave/balance', { params }),
};

export const salaryService = {
  getMy: () => api.get('/salary/my'),
  getAll: (params) => api.get('/salary', { params }),
  getByUser: (userId) => api.get(`/salary/${userId}`),
  update: (userId, data) => api.put(`/salary/${userId}`, data),
  processPayroll: (data) => api.post('/salary/process', data),
};

export const dashboardService = {
  getAdmin: () => api.get('/dashboard/admin'),
  getEmployee: () => api.get('/dashboard/employee'),
  getNotifications: () => api.get('/dashboard/notifications'),
  markNotificationsRead: () => api.put('/dashboard/notifications/read'),
  getHolidays: (params) => api.get('/dashboard/holidays', { params }),
};
