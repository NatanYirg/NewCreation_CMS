import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Members API
export const membersAPI = {
  getAll: (params?: { status?: string; type?: string }) =>
    api.get('/members', { params }),
  getById: (id: number) => api.get(`/members/${id}`),
  create: (data: FormData) => api.post('/members', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put(`/members/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/members/${id}`),
  updateStatus: (id: number, status: string, reason?: string) =>
    api.patch(`/members/${id}/status`, { status, inactiveReason: reason }),
};

// Foundation Classes API
export const foundationClassesAPI = {
  getAll: () => api.get('/foundation-classes'),
  getById: (id: number) => api.get(`/foundation-classes/${id}`),
  create: (data: { name: string; level: number }) => api.post('/foundation-classes', data),
  update: (id: number, data: { name: string; level: number }) =>
    api.put(`/foundation-classes/${id}`, data),
  delete: (id: number) => api.delete(`/foundation-classes/${id}`),
};

// Foundation Class Members API
export const foundationClassMembersAPI = {
  // Assign (or re-assign) a member to a class — handles transfer automatically
  assign: (memberId: number, foundationClassId: number) =>
    api.post('/foundation-class-members/assign', { memberId, foundationClassId }),
  // Bulk assign many members to a class at once
  bulkAssign: (foundationClassId: number, memberIds: number[]) =>
    api.post('/foundation-class-members/bulk-assign', { foundationClassId, memberIds }),
  // Explicit transfer to a new class
  transfer: (memberId: number, foundationClassId: number) =>
    api.patch(`/foundation-class-members/transfer/${memberId}`, { foundationClassId }),
  // Get current active class for a member
  getMemberClass: (memberId: number) =>
    api.get(`/foundation-class-members/member/${memberId}`),
  // Get full class history for a member
  getMemberClassHistory: (memberId: number) =>
    api.get(`/foundation-class-members/member/${memberId}/history`),
  // List active members in a class
  getClassMembers: (classId: number) =>
    api.get(`/foundation-class-members/class/${classId}`),
  // Remove member from their current class
  remove: (memberId: number) =>
    api.delete(`/foundation-class-members/member/${memberId}`),
  // Members with no foundation class (children, youth, unassigned)
  getUnassigned: () =>
    api.get('/foundation-class-members/unassigned'),
};

// Attendance API
export const attendanceAPI = {
  createSession: (foundationClassId: number, sessionDate: string, notes?: string) =>
    api.post('/attendance/sessions', { foundationClassId, sessionDate, notes }),
  getSessionsByClass: (classId: number) =>
    api.get(`/attendance/sessions/class/${classId}`),
  getSession: (sessionId: number) =>
    api.get(`/attendance/sessions/${sessionId}`),
  getRoster: (sessionId: number) =>
    api.get(`/attendance/sessions/${sessionId}/roster`),
  recordAttendance: (sessionId: number, memberId: number, present: boolean) =>
    api.post(`/attendance/sessions/${sessionId}/record`, { memberId, present }),
  recordBulk: (sessionId: number, records: { memberId: number; present: boolean }[]) =>
    api.post(`/attendance/sessions/${sessionId}/bulk`, { records }),
  getSummary: (sessionId: number) =>
    api.get(`/attendance/sessions/${sessionId}/summary`),
};

// Tithe API
export const titheAPI = {
  record: (data: {
    amount: number;
    type: string;
    name?: string;
    email?: string;
    phone?: string;
    memberId?: number;
    foundationClassId?: number;
    date: string;
    notes?: string;
  }) => api.post('/tithe', data),
  getAll: () => api.get('/tithe'),
  getById: (id: number) => api.get(`/tithe/${id}`),
  delete: (id: number) => api.delete(`/tithe/${id}`),
  getMemberTithes: (memberId: number) =>
    api.get(`/tithe/member/${memberId}`),
  getMonthlyStats: (year: number, month: number) =>
    api.get('/tithe/analytics/monthly', { params: { year, month } }),
  getYearlyStats: (year: number) =>
    api.get('/tithe/analytics/yearly', { params: { year } }),
};

// Dashboard API
export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getClassDashboard: (classId: number) =>
    api.get(`/dashboard/foundation-class/${classId}`),
  getWeeklyAttendance: () =>
    api.get('/dashboard/attendance/weekly'),
  getMonthlyTithe: () =>
    api.get('/dashboard/tithe/monthly'),
};

export default api;
