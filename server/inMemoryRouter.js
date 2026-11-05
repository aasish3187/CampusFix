const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'campusfix_jwt_super_secret_key_2026';

// Helper to create clean inline SVG image data URLs
function makeSvgDataUri(title, subtitle, color = '#2563eb', bg = '#eff6ff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="${bg}"/>
    <rect x="20" y="20" width="560" height="360" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="300" cy="150" r="44" fill="${color}" opacity="0.12"/>
    <path d="M285 150h30M300 135v30" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <text x="300" y="225" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="19" font-weight="bold" fill="#0f172a" text-anchor="middle">${title}</text>
    <text x="300" y="255" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">${subtitle}</text>
    <rect x="210" y="285" width="180" height="32" rx="16" fill="${color}"/>
    <text x="300" y="306" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="600" fill="#ffffff" text-anchor="middle">VERIFIED ON-SITE PROOF</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const photoProjector = makeSvgDataUri('Projector Unit C-204', 'Loose HDMI socket & intermittent flicker', '#2563eb', '#eff6ff');
const photoWaterLeak = makeSvgDataUri('Ground Floor Restroom', 'Leaking pipe under turnstile valve', '#0284c7', '#f0f9ff');
const photoWifi = makeSvgDataUri('PoE Switch HB-04', 'Damaged Ethernet injector replaced', '#7c3aed', '#f5f3ff');
const photoSanitation = makeSvgDataUri('Restroom Dispenser', 'Soap reservoir empty and floor drain clogged', '#059669', '#ecfdf5');
const photoMic = makeSvgDataUri('Main Auditorium Podium', 'Wireless receiver cross-talk and battery depleted', '#d97706', '#fffbeb');

const users = [
  { _id: 'u_admin', name: 'Riya Sharma', email: 'riya@campusfix.edu', role: 'admin', department: 'Facilities Administration', isActive: true },
  { _id: 'u_student', name: 'Aasish Student', email: 'aasish@campusfix.edu', role: 'student', department: 'Computer Science & Engineering', isActive: true },
  { _id: 'u_arjun', name: 'Arjun Kumar', email: 'arjun@campusfix.edu', role: 'staff', department: 'Electrical & Equipment', isActive: true },
  { _id: 'u_nikhil', name: 'Nikhil Rao', email: 'nikhil@campusfix.edu', role: 'staff', department: 'Plumbing & Water Systems', isActive: true },
  { _id: 'u_priya', name: 'Priya Sharma', email: 'priya@campusfix.edu', role: 'staff', department: 'Network & IT Infrastructure', isActive: true },
  { _id: 'u_anita', name: 'Anita Devi', email: 'anita@campusfix.edu', role: 'staff', department: 'Sanitation & Housekeeping', isActive: true }
];

let tickets = [
  {
    _id: 't_1',
    ticketCode: 'CF-2026-1886',
    title: 'ac not working',
    category: 'Classroom Equipment',
    building: 'B Block',
    room: '413',
    location: 'B Block • 413',
    status: 'Assigned',
    priority: 'High',
    description: 'ac is not working in Room 413. Temperature is unbearable for ongoing afternoon lectures.',
    images: [photoProjector],
    assignedTo: users.find(u => u.name === 'Nikhil Rao'),
    createdBy: users.find(u => u.name === 'Aasish Student'),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 't_2',
    ticketCode: 'CF-2026-1884',
    title: 'Water cooler leak in A-Block 1st floor',
    category: 'Plumbing',
    building: 'A Block',
    room: 'Room 105 hallway',
    location: 'A Block • Room 105 hallway',
    status: 'Assigned',
    priority: 'High',
    description: 'Water cooler drain pipe is leaking onto hallway tiles causing slipping hazard.',
    images: [photoWaterLeak],
    assignedTo: users.find(u => u.name === 'Anita Devi'),
    createdBy: users.find(u => u.name === 'Aasish Student'),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString()
  },
  {
    _id: 't_3',
    ticketCode: 'CF-2026-1885',
    title: 'Broken laboratory chair with sharp edges',
    category: 'Furniture',
    building: 'B Block',
    room: 'Lab 3, Station 8',
    location: 'B Block • Lab 3, Station 8',
    status: 'In progress',
    priority: 'Medium',
    description: 'Student swivel chair hydraulic cylinder failed and backrest steel edge exposed.',
    images: [],
    assignedTo: users.find(u => u.name === 'Anita Devi'),
    createdBy: users.find(u => u.name === 'Aasish Student'),
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 't_4',
    ticketCode: 'CF-2026-1837',
    title: 'Water leakage near library entrance',
    category: 'Plumbing',
    building: 'Central Library',
    room: 'Ground floor lobby',
    location: 'Central Library • Ground floor lobby',
    status: 'Assigned',
    priority: 'Medium',
    description: 'Water is pooling near entrance lobby whenever overhead tank is full.',
    images: [photoWaterLeak],
    assignedTo: users.find(u => u.name === 'Nikhil Rao'),
    createdBy: users.find(u => u.name === 'Aasish Student'),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    _id: 't_5',
    ticketCode: 'CF-2026-1847',
    title: 'HDMI cable damaged in C-204',
    category: 'Classroom Equipment',
    building: 'C Block',
    room: 'Room 204',
    location: 'C Block • Room 204',
    status: 'Resolved',
    priority: 'High',
    description: 'Podium HDMI cable was severed. Replaced with brand new 4K gold-plated cable.',
    resolutionNote: 'Installed new 5-meter braided HDMI cable and tested output with laptop at 60Hz.',
    images: [photoProjector],
    assignedTo: users.find(u => u.name === 'Arjun Kumar'),
    createdBy: users.find(u => u.name === 'Aasish Student'),
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    updatedAt: new Date(Date.now() - 18000000).toISOString()
  },
  {
    _id: 't_6',
    ticketCode: 'CF-2026-1796',
    title: 'Auditorium microphone failure',
    category: 'Classroom Equipment',
    building: 'A Block',
    room: 'Main Auditorium',
    location: 'A Block • Main Auditorium',
    status: 'Resolved',
    priority: 'High',
    description: 'Wireless handheld mic dropped signal constantly during rehearsals.',
    resolutionNote: 'Re-paired frequency band on receiver unit and replaced AA rechargeable cells.',
    images: [photoMic],
    assignedTo: users.find(u => u.name === 'Arjun Kumar'),
    createdBy: users.find(u => u.name === 'Aasish Student'),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 36000000).toISOString()
  },
  {
    _id: 't_7',
    ticketCode: 'CF-2026-1812',
    title: 'Washroom cleaning required',
    category: 'Sanitation',
    building: 'A Block',
    room: '3rd floor west wing',
    location: 'A Block • 3rd floor west wing',
    status: 'Closed',
    priority: 'Medium',
    description: 'Soap dispensers empty and floor drain blocked.',
    resolutionNote: 'Deep cleaned, sanitized tiles, unblocked floor drain, and refilled antibacterial soap.',
    images: [photoSanitation],
    assignedTo: users.find(u => u.name === 'Anita Devi'),
    createdBy: users.find(u => u.name === 'Aasish Student'),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let activities = [
  { _id: 'act_1', ticketId: 't_1', action: 'Assignment updated', newValue: 'Nikhil Rao', performedBy: { name: 'Riya Sharma', role: 'admin' }, createdAt: new Date().toISOString() },
  { _id: 'act_2', ticketId: 't_1', action: 'Priority updated', newValue: 'High', performedBy: { name: 'Riya Sharma', role: 'admin' }, createdAt: new Date().toISOString() },
  { _id: 'act_3', ticketId: 't_1', action: 'Issue submitted', newValue: 'Submitted', performedBy: { name: 'Aasish Student', role: 'student' }, note: 'ac is not working', createdAt: new Date(Date.now() - 3600000).toISOString() }
];

let feedbacks = {
  't_5': { rating: 5, comment: 'Quick response! The technician replaced the HDMI cable in under 45 minutes.', createdAt: new Date(Date.now() - 14400000).toISOString() },
  't_6': { rating: 5, comment: 'Mic sounded crystal clear for our symposium.', createdAt: new Date(Date.now() - 28800000).toISOString() }
};

let notifications = [
  { _id: 'notif_1', title: 'Work Assigned', message: 'You have been assigned issue CF-2026-1886 (ac not working) in B Block.', isRead: false, createdAt: new Date().toISOString() },
  { _id: 'notif_2', title: 'Issue Resolved', message: 'HDMI cable in C-204 was resolved by Arjun Kumar.', isRead: false, createdAt: new Date(Date.now() - 18000000).toISOString() },
  { _id: 'notif_3', title: 'Welcome to CampusFix', message: 'Smart campus facility tracking is active.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
];

// Auth middleware for in-memory mode
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    req.user = users[1]; // default to Aasish Student
    return next();
  }
  try {
    const dec = jwt.verify(h.split(' ')[1], JWT_SECRET);
    req.user = users.find(u => u._id === dec.id) || users[1];
  } catch {
    req.user = users[1];
  }
  next();
}

// ----------------- AUTH ROUTES -----------------
router.post('/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) ||
    users.find(u => u.role === role) ||
    users[1];
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

router.post('/auth/register', (req, res) => {
  const { name, email, department, role = 'student' } = req.body;
  const newUser = { _id: 'u_' + Date.now(), name, email: email.toLowerCase(), department, role, isActive: true };
  users.push(newUser);
  const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: newUser });
});

router.get('/auth/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// ----------------- TICKET ROUTES -----------------
router.get('/tickets/staff-list', (req, res) => {
  res.json({ staff: users.filter(u => u.role === 'staff') });
});

router.get('/tickets/check-duplicates', (req, res) => {
  res.json({ duplicates: [] });
});

router.get('/tickets', auth, (req, res) => {
  let list = [...tickets];
  if (req.user?.role === 'staff') {
    list = list.filter(t => t.assignedTo?._id === req.user._id || t.assignedTo?.email === req.user.email);
  } else if (req.user?.role === 'student' || req.user?.role === 'faculty') {
    list = list.filter(t => t.createdBy?._id === req.user._id || t.createdBy?.email === req.user.email);
  }
  list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  res.json({ tickets: list });
});

router.get('/tickets/:id', (req, res) => {
  const t = tickets.find(x => x._id === req.params.id || x.ticketCode === req.params.id);
  if (!t) return res.status(404).json({ message: 'Ticket not found' });
  const fb = feedbacks[t._id] || feedbacks[t.ticketCode] || null;
  res.json({ ticket: t, feedback: fb });
});

router.post('/tickets', auth, (req, res) => {
  const code = `CF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newT = {
    _id: 't_' + Date.now(),
    ticketCode: code,
    title: req.body.title,
    category: req.body.category,
    building: req.body.building,
    room: req.body.room,
    location: `${req.body.building || 'Campus'} • ${req.body.room || 'Room'}`,
    status: 'Submitted',
    priority: req.body.priority || 'Medium',
    description: req.body.description,
    images: req.body.images || [],
    assignedTo: null,
    createdBy: req.user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tickets.unshift(newT);
  activities.unshift({
    _id: 'act_' + Date.now(),
    ticketId: newT._id,
    action: 'Issue submitted',
    newValue: 'Submitted',
    performedBy: req.user,
    note: newT.description,
    createdAt: new Date().toISOString()
  });
  res.status(201).json({ success: true, ticket: newT });
});

router.patch('/tickets/:id', auth, (req, res) => {
  const t = tickets.find(x => x._id === req.params.id || x.ticketCode === req.params.id);
  if (!t) return res.status(404).json({ message: 'Ticket not found' });

  if (req.body.status) t.status = req.body.status;
  if (req.body.priority) t.priority = req.body.priority;
  if (req.body.resolutionNote) t.resolutionNote = req.body.resolutionNote;
  if (req.body.assignee !== undefined) {
    if (!req.body.assignee || req.body.assignee === 'Unassigned') {
      t.assignedTo = null;
    } else {
      const staffUser = users.find(u => u.name.toLowerCase() === req.body.assignee.toLowerCase() || u.email === req.body.assignee) || { name: req.body.assignee, role: 'staff' };
      t.assignedTo = staffUser;
      if (t.status === 'Submitted' || t.status === 'Reopened') t.status = 'Assigned';
    }
  }
  t.updatedAt = new Date().toISOString();

  activities.unshift({
    _id: 'act_' + Date.now(),
    ticketId: t._id,
    action: req.body.assignee ? `Assignment updated → ${req.body.assignee}` : `Status updated → ${t.status}`,
    newValue: req.body.assignee || t.status,
    performedBy: req.user,
    note: req.body.note || req.body.resolutionNote || '',
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, ticket: t });
});

router.post('/tickets/:id/reopen', auth, (req, res) => {
  const t = tickets.find(x => x._id === req.params.id || x.ticketCode === req.params.id);
  if (t) {
    t.status = 'Reopened';
    t.updatedAt = new Date().toISOString();
  }
  res.json({ success: true, ticket: t });
});

router.post('/tickets/:id/feedback', auth, (req, res) => {
  const { rating, comment } = req.body;
  feedbacks[req.params.id] = { rating, comment, createdAt: new Date().toISOString() };
  res.status(201).json({ success: true, feedback: feedbacks[req.params.id] });
});

router.get('/tickets/:id/activities', (req, res) => {
  const act = activities.filter(a => a.ticketId === req.params.id || true).slice(0, 8);
  res.json({ activities: act });
});

// ----------------- ADMIN & STATS -----------------
router.get('/admin/users', (req, res) => {
  res.json({ users });
});

router.get('/admin/analytics', (req, res) => {
  const total = tickets.length;
  const resolved = tickets.filter(t => ['Resolved', 'Closed'].includes(t.status)).length;
  const pending = total - resolved;
  res.json({
    stats: {
      totalTickets: total,
      resolvedTickets: resolved,
      pendingTickets: pending,
      avgResolutionHours: 18.4,
      satisfactionRate: 4.8
    }
  });
});

// ----------------- NOTIFICATIONS -----------------
router.get('/notifications', (req, res) => {
  res.json({ notifications });
});

router.patch('/notifications/:id/read', (req, res) => {
  const n = notifications.find(x => x._id === req.params.id);
  if (n) n.isRead = true;
  res.json({ success: true });
});

router.patch('/notifications/mark-all-read', (req, res) => {
  notifications.forEach(n => n.isRead = true);
  res.json({ success: true });
});

module.exports = router;

