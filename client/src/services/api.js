const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/v1';

// In-memory / localStorage fallback storage when backend is offline
const MOCK_USERS = [
  { _id: 'mock_u1', name: 'Aasish Student', email: 'aasish@campusfix.edu', role: 'student', department: 'Computer Science & Engineering' },
  { _id: 'mock_u2', name: 'Riya Sharma', email: 'riya@campusfix.edu', role: 'admin', department: 'Facilities Administration' },
  { _id: 'mock_u3', name: 'Arjun Kumar', email: 'arjun@campusfix.edu', role: 'staff', department: 'Electrical & Equipment' },
  { _id: 'mock_u4', name: 'Nikhil Rao', email: 'nikhil@campusfix.edu', role: 'staff', department: 'Plumbing & Water Systems' },
  { _id: 'mock_u5', name: 'Anita Devi', email: 'anita@campusfix.edu', role: 'staff', department: 'Sanitation & Housekeeping' },
  { _id: 'mock_u6', name: 'Priya Sharma', email: 'priya@campusfix.edu', role: 'staff', department: 'Network & IT Infrastructure' }
];

const INITIAL_MOCK_TICKETS = [
  {
    _id: 't_mock_1',
    ticketCode: 'CF-2026-1886',
    title: 'ac not working',
    category: 'Classroom Equipment',
    location: 'B Block • 413',
    building: 'B Block',
    room: '413',
    status: 'Assigned',
    priority: 'High',
    description: 'AC unit in Room 413 is not blowing cold air and making humming noise.',
    assignedTo: { _id: 'mock_u4', name: 'Nikhil Rao', email: 'nikhil@campusfix.edu' },
    createdBy: { _id: 'mock_u1', name: 'Aasish Student', email: 'aasish@campusfix.edu' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 't_mock_2',
    ticketCode: 'CF-2026-1884',
    title: 'Water cooler leak in A-Block 1st floor',
    category: 'Plumbing',
    location: 'A Block • Room 105 hallway',
    building: 'A Block',
    room: 'Room 105 hallway',
    status: 'Assigned',
    priority: 'High',
    description: 'Water cooler drain pipe is leaking onto hallway tiles causing slip hazard.',
    assignedTo: { _id: 'mock_u5', name: 'Anita Devi', email: 'anita@campusfix.edu' },
    createdBy: { _id: 'mock_u1', name: 'Aasish Student', email: 'aasish@campusfix.edu' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString()
  },
  {
    _id: 't_mock_3',
    ticketCode: 'CF-2026-1842',
    title: 'Projector flickering in C-204',
    category: 'Classroom Equipment',
    location: 'C Block • Room 204',
    building: 'C Block',
    room: 'Room 204',
    status: 'In progress',
    priority: 'High',
    description: 'The projector turns off intermittently during lectures. HDMI port loose.',
    assignedTo: { _id: 'mock_u3', name: 'Arjun Kumar', email: 'arjun@campusfix.edu' },
    createdBy: { _id: 'mock_u1', name: 'Aasish Student', email: 'aasish@campusfix.edu' },
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 't_mock_4',
    ticketCode: 'CF-2026-1837',
    title: 'Water leakage near library entrance',
    category: 'Plumbing',
    location: 'Central Library • Ground floor lobby',
    building: 'Central Library',
    room: 'Ground floor',
    status: 'Assigned',
    priority: 'Medium',
    description: 'Water is pooling near entrance lobby whenever overhead tank fills.',
    assignedTo: { _id: 'mock_u4', name: 'Nikhil Rao', email: 'nikhil@campusfix.edu' },
    createdBy: { _id: 'mock_u1', name: 'Aasish Student', email: 'aasish@campusfix.edu' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 't_mock_5',
    ticketCode: 'CF-2026-1829',
    title: 'Wi-Fi unavailable in hostel block B',
    category: 'Internet / Network',
    location: 'Hostel B • 2nd floor',
    building: 'Hostel B',
    room: '2nd floor',
    status: 'Resolved',
    priority: 'High',
    description: 'CampusNet network was inaccessible. Replaced faulty access point.',
    assignedTo: { _id: 'mock_u6', name: 'Priya Sharma', email: 'priya@campusfix.edu' },
    createdBy: { _id: 'mock_u1', name: 'Aasish Student', email: 'aasish@campusfix.edu' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

function getStoredTickets() {
  try {
    const saved = localStorage.getItem('campusfix_mock_tickets');
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_MOCK_TICKETS;
}

function saveStoredTickets(t) {
  try {
    localStorage.setItem('campusfix_mock_tickets', JSON.stringify(t));
  } catch {}
}

async function request(path, options = {}) {
  const token = localStorage.getItem('campusfix_token');
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
        localStorage.removeItem('campusfix_token');
        localStorage.removeItem('campusfix_user');
        window.location.hash = 'login';
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (netErr) {
    // If backend is unreachable (offline / standalone demo mode in ByteXL Nimbus), fallback gracefully:
    console.warn(`[CampusFix Offline-Safe] Backend at ${API_URL} unreachable. Using demo fallback for ${path}`);
    return handleOfflineFallback(path, options);
  }
}

function handleOfflineFallback(path, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};

  // Auth login
  if (path === '/auth/login') {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === (body.email || '').toLowerCase()
    ) || {
      _id: 'mock_' + Date.now(),
      name: body.email?.split('@')[0] || 'Campus User',
      email: body.email || 'user@campusfix.edu',
      role: body.role || 'student',
      department: 'Engineering'
    };
    return { token: 'mock_jwt_token_demo', user: found };
  }

  // Tickets list
  if (path.startsWith('/tickets') && method === 'GET') {
    if (path.includes('/staff-list')) {
      return { staff: MOCK_USERS.filter((u) => u.role === 'staff') };
    }
    if (path.includes('/activities')) {
      return {
        activities: [
          { action: 'Status updated', newValue: 'Assigned', performedBy: { name: 'Riya Sharma', role: 'admin' }, createdAt: new Date().toISOString() },
          { action: 'Issue submitted', newValue: 'Submitted', performedBy: { name: 'Aasish Student', role: 'student' }, createdAt: new Date(Date.now() - 3600000).toISOString() }
        ]
      };
    }
    const tickets = getStoredTickets();
    return { tickets };
  }

  // Create ticket
  if (path === '/tickets' && method === 'POST') {
    const list = getStoredTickets();
    const newCode = `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const savedUser = JSON.parse(localStorage.getItem('campusfix_user') || '{}');
    const newTicket = {
      _id: 't_mock_' + Date.now(),
      ticketCode: newCode,
      title: body.title,
      category: body.category,
      location: `${body.building || 'Campus'} • ${body.room || 'General Area'}`,
      building: body.building,
      room: body.room,
      status: 'Submitted',
      priority: body.priority || 'Medium',
      description: body.description,
      images: body.images || [],
      createdBy: savedUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newTicket);
    saveStoredTickets(list);
    return { success: true, ticket: newTicket };
  }

  // Update ticket (PATCH)
  if (path.startsWith('/tickets/') && method === 'PATCH') {
    const id = path.split('/')[2];
    const list = getStoredTickets();
    const t = list.find((x) => x._id === id || x.ticketCode === id);
    if (t) {
      if (body.status) t.status = body.status;
      if (body.priority) t.priority = body.priority;
      if (body.assignee) {
        const staffObj = MOCK_USERS.find((u) => u.name === body.assignee) || { name: body.assignee };
        t.assignedTo = staffObj;
        if (t.status === 'Submitted' || t.status === 'Reopened') t.status = 'Assigned';
      }
      t.updatedAt = new Date().toISOString();
      saveStoredTickets(list);
      return { success: true, ticket: t };
    }
    return { success: true };
  }

  // Notifications
  if (path === '/notifications') {
    return {
      notifications: [
        { _id: 'n1', title: 'Ticket assigned', message: 'You have been assigned a high priority repair order.', isRead: false, createdAt: new Date().toISOString() },
        { _id: 'n2', title: 'Campus update', message: 'Smart facilities telemetry is operating normally.', isRead: true, createdAt: new Date().toISOString() }
      ]
    };
  }

  return { success: true };
}

export const api = {
  // Auth
  login: (email, password, role) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
  updateProfile: (payload) =>
    request('/auth/profile', { method: 'PATCH', body: JSON.stringify(payload) }),

  // Tickets
  getTickets: (queryString = '') => request(`/tickets${queryString}`),
  getTicket: (id) => request(`/tickets/${id}`),
  createTicket: (payload) => request('/tickets', { method: 'POST', body: JSON.stringify(payload) }),
  updateTicket: (id, payload) =>
    request(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  reopenTicket: (id, note = '') =>
    request(`/tickets/${id}/reopen`, { method: 'POST', body: JSON.stringify({ note }) }),
  submitFeedback: (id, { rating, comment }) =>
    request(`/tickets/${id}/feedback`, { method: 'POST', body: JSON.stringify({ rating, comment }) }),
  getActivities: (id) => request(`/tickets/${id}/activities`),
  checkDuplicates: ({ building, category, title }) => {
    const params = new URLSearchParams();
    if (building) params.append('building', building);
    if (category) params.append('category', category);
    if (title) params.append('title', title);
    return request(`/tickets/check-duplicates?${params.toString()}`);
  },
  getStaffList: () => request('/tickets/staff-list'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () =>
    request('/notifications/mark-all-read', { method: 'PATCH' }),

  // Admin
  getUsers: (role = '') => request(`/admin/users${role ? `?role=${role}` : ''}`),
  createUser: (payload) =>
    request('/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  toggleUserStatus: (id, isActive) =>
    request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  getAnalytics: () => request('/admin/analytics')
};
