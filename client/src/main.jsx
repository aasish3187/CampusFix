import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './roles.css';
import './auth.css';
import './extra.css';
import { api } from './services/api';

const Icons = {
  dashboard: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  tickets: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  add: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  team: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  analytics: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  bell: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  search: (props) => (
    <svg width={props?.size || 16} height={props?.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  pin: (props) => (
    <svg width={props?.size || 14} height={props?.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (props) => (
    <svg width={props?.size || 14} height={props?.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (props) => (
    <svg width={props?.size || 16} height={props?.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  star: (props) => (
    <svg width={props?.size || 16} height={props?.size || 16} viewBox="0 0 24 24" fill={props?.fill || 'currentColor'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  image: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  upload: (props) => (
    <svg width={props?.size || 20} height={props?.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  logout: (props) => (
    <svg width={props?.size || 16} height={props?.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  spark: (props) => (
    <svg width={props?.size || 16} height={props?.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  help: (props) => (
    <svg width={props?.size || 16} height={props?.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  menu: (props) => (
    <svg width={props?.size || 20} height={props?.size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  arrow: (props) => (
    <svg width={props?.size || 14} height={props?.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  chevronRight: (props) => (
    <svg width={props?.size || 14} height={props?.size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  alert: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  wrench: (props) => (
    <svg width={props?.size || 18} height={props?.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={props?.className || ''}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
};

const icons = {
  dashboard: <Icons.dashboard size={18} />,
  tickets: <Icons.tickets size={18} />,
  add: <Icons.add size={18} />,
  team: <Icons.team size={18} />,
  analytics: <Icons.analytics size={18} />,
  bell: <Icons.bell size={19} />,
  logout: <Icons.logout size={16} />,
  search: <Icons.search size={16} />,
  pin: <Icons.pin size={14} />,
  clock: <Icons.clock size={14} />,
  check: <Icons.check size={16} />,
  star: <Icons.star size={16} />,
  image: <Icons.image size={18} />,
  upload: <Icons.upload size={20} />,
  menu: <Icons.menu size={20} />,
  spark: <Icons.spark size={16} />,
  help: <Icons.help size={16} />,
  arrow: <Icons.arrow size={14} />
};

const navItems = [
  { id: 'dashboard', label: 'Overview', icon: 'dashboard' },
  { id: 'tickets', label: 'All issues', icon: 'tickets' },
  { id: 'report', label: 'Report an issue', icon: 'add' },
  { id: 'team', label: 'Team & workload', icon: 'team' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' }
];

// -------------------------------------------------------------
// POETIC REVOLUTIONARY CAMPUSFIX LOGO (CAMPUS + TOOLS + LENS)
// -------------------------------------------------------------
function CampusFixEmblem({ size = 36, className = '' }) {
  return (
    <span className={`brand-mark-emblem ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <linearGradient id="emblemBgGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="emblemRoofGrad" x1="6" y1="8" x2="38" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="emblemWrenchGrad" x1="14" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Shield container with subtle bevel */}
        <rect x="2" y="2" width="40" height="40" rx="10" fill="url(#emblemBgGrad)" />
        <rect x="2" y="2" width="40" height="40" rx="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Classical Collegiate Building Roof / Pediment */}
        <path d="M22 6L37 16H7L22 6Z" fill="url(#emblemRoofGrad)" />
        <rect x="8" y="16" width="28" height="2" rx="0.5" fill="#ffffff" />

        {/* Pillars / Columns */}
        <rect x="11" y="20" width="3" height="12" rx="0.8" fill="#e2e8f0" opacity="0.95" />
        <rect x="17" y="20" width="3" height="12" rx="0.8" fill="#e2e8f0" opacity="0.95" />
        <rect x="24" y="20" width="3" height="12" rx="0.8" fill="#e2e8f0" opacity="0.95" />
        <rect x="30" y="20" width="3" height="12" rx="0.8" fill="#e2e8f0" opacity="0.95" />

        {/* Building Steps / Foundation */}
        <rect x="7" y="32" width="30" height="2" rx="0.6" fill="#cbd5e1" />
        <rect x="5" y="34.5" width="34" height="2" rx="0.6" fill="#94a3b8" />

        {/* Integrated Golden Maintenance Wrench (dynamic diagonal) */}
        <g className="emblem-wrench-group" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
          <path
            d="M32 10C30.8 9 29.2 8.8 28 9.4L29.5 12C29.9 12.7 29.6 13.5 28.9 13.9L27.6 14.6C26.9 15 26.1 14.7 25.7 14L24.2 11.4C23 12.2 22.4 13.7 22.8 15L17.5 25.5C17.1 26.3 17.5 27.3 18.3 27.7L19.5 28.3C20.3 28.7 21.3 28.3 21.7 27.5L27 17C28.3 17.2 29.6 16.5 30.3 15.3C31 14 31.2 12.2 32 10Z"
            fill="url(#emblemWrenchGrad)"
            stroke="#ffffff"
            strokeWidth="0.8"
          />
        </g>

        {/* Problem Inspecting Magnifying Glass (Over the pillars) */}
        <g className="emblem-lens-group" filter="drop-shadow(0 2px 4px rgba(14,165,233,0.4))">
          <circle cx="18.5" cy="23.5" r="7.5" fill="rgba(56, 189, 248, 0.28)" stroke="#38bdf8" strokeWidth="2" />
          <path d="M15 20C16 18.8 17.5 18.2 19 18.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="18.5" y1="21.5" x2="18.5" y2="25.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          <line x1="16.5" y1="23.5" x2="20.5" y2="23.5" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          <circle cx="18.5" cy="23.5" r="1.2" fill="#f59e0b" />
          <path d="M24 29L30 35" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 29L30 35" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Verified Resolution Star at Top Apex */}
        <path
          className="emblem-spark"
          d="M22 3L23 5.4L25.5 6.4L23 7.4L22 9.8L21 7.4L18.5 6.4L21 5.4L22 3Z"
          fill="#10b981"
          stroke="#ffffff"
          strokeWidth="0.6"
        />
      </svg>
    </span>
  );
}

function LetterALens({ size = 15, color = 'currentColor', accent = '#38bdf8' }) {
  return (
    <span className="logo-letter-lens" title="Search magnifying glass detecting campus issues">
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'baseline', marginBottom: -1 }}
      >
        <circle cx="6.5" cy="7" r="4.8" stroke={color} strokeWidth="2.2" />
        <circle cx="6.5" cy="7" r="3.2" fill="rgba(56, 189, 248, 0.22)" stroke={accent} strokeWidth="0.8" />
        <path d="M4.5 5C5.2 4.2 6.5 4 7.5 4.3" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <circle cx="6.5" cy="7" r="0.9" fill={accent} />
        <path d="M10.2 6.5V10.5L13.8 14.2" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 10.8L13.8 14.2" stroke={accent} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function LetterXTools({ size = 15, color = '#60a5fa', accent = '#f59e0b' }) {
  return (
    <span className="logo-letter-tools" title="Precision maintenance repair tools">
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'baseline', marginBottom: -1 }}
      >
        <path
          d="M2.5 1.8C3.2 1.1 4.3 1.1 5 1.8L6.2 3L5 4.2L4 3.2C3.5 2.8 2.8 3.1 2.5 3.5C2.1 3.9 2.3 4.5 2.7 5L3.8 6.1L2.6 7.3L1.5 6.2C0.7 5.4 0.7 4.3 1.5 3.5Z"
          fill={accent}
        />
        <line x1="4.2" y1="4.2" x2="13.5" y2="13.5" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="13.5" cy="13.5" r="1" fill={accent} />

        <line x1="2.8" y1="13.5" x2="12.2" y2="4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M11 5.2L12.5 3.7L13.8 5L12.3 6.5Z" fill={color} />
        <line x1="2.8" y1="13.5" x2="4.8" y2="11.5" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />

        <circle cx="8" cy="8.2" r="1.1" fill="#ffffff" />
      </svg>
    </span>
  );
}

function CampusFixLogo({ theme = 'dark', size = 'default', showTagline = false, titleCase = true }) {
  const isLight = theme === 'light';
  const campusColor = isLight ? '#0f172a' : '#ffffff';
  const fixColor = isLight ? '#2563eb' : '#60a5fa';
  const lensAccent = '#38bdf8';
  const toolAccent = '#f59e0b';

  return (
    <div className={`cf-brand-logo ${isLight ? 'theme-light' : 'theme-dark'}`}>
      <CampusFixEmblem size={size === 'large' ? 40 : 34} />
      <div className="cf-brand-text">
        <span className="cf-brand-wordmark">
          <span className="word-campus" style={{ color: campusColor }}>
            {titleCase ? 'C' : 'c'}
            <LetterALens size={15} color={campusColor} accent={lensAccent} />
            mpus
          </span>
          <span className="word-fix" style={{ color: fixColor }}>
            {titleCase ? 'F' : 'f'}
            <span className="letter-i-wrapper">
              i<span className="letter-i-spark">✦</span>
            </span>
            <LetterXTools size={15} color={fixColor} accent={toolAccent} />
          </span>
        </span>
        {showTagline && (
          <span className="cf-brand-tagline">SMART RESOLUTION</span>
        )}
      </div>
    </div>
  );
}

const statusClass = (status) => `badge ${(status || 'submitted').toLowerCase().replace(/\s+/g, '-')}`;

const toViewTicket = (t) => ({
  ...t,
  id: t.ticketCode || t.id || t._id,
  _mongoId: t._id || t.id,
  assignee: t.assignedTo?.name || t.assignee || null,
  assigneeId: t.assignedTo?._id || t.assignedTo || null,
  avatar: t.assignedTo?.name?.split(' ').map((x) => x[0]).join('').slice(0, 2) || t.avatar || null,
  date: t.updatedAt
    ? new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : t.date || 'Just now',
  reporterName: t.createdBy?.name || t.reporterName || 'Student Reporter',
  reporterDept: t.createdBy?.department || t.reporterDept || 'Engineering',
  reporterEmail: t.createdBy?.email || t.reporterEmail || '',
  reporterRole: t.createdBy?.role || t.reporterRole || 'student'
});

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusfix_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [page, setPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (localStorage.getItem('campusfix_token')) {
      return ['dashboard', 'tickets', 'report', 'team', 'analytics', 'detail'].includes(hash) ? hash : 'dashboard';
    }
    return hash === 'login' ? 'login' : 'landing';
  });

  const [query, setQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketList, setTicketList] = useState([]);
  const [toast, setToast] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const notify = (msg) => {
    setToast(msg);
    window.clearTimeout(window._toastTimer);
    window._toastTimer = window.setTimeout(() => setToast(''), 3500);
  };

  // Synchronize browser history / URL hash
  const go = (p) => {
    setPage(p);
    window.location.hash = p;
    setMobileOpen(false);
    setNotifOpen(false);
  };

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h) setPage(h);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K to focus search input
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.getElementById('globalSearchInput');
        if (el) el.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Check auth session on load
  useEffect(() => {
    const token = localStorage.getItem('campusfix_token');
    if (token) {
      api.me()
        .then((res) => {
          if (res.user) {
            setCurrentUser(res.user);
            localStorage.setItem('campusfix_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  // Fetch tickets and notifications when logged in
  const loadTickets = async () => {
    if (!localStorage.getItem('campusfix_token')) return;
    try {
      const res = await api.getTickets();
      if (res.tickets) {
        const mapped = res.tickets.map(toViewTicket);
        setTicketList(mapped);
        if (selectedTicket) {
          const fresh = mapped.find((m) => m._mongoId === selectedTicket._mongoId);
          if (fresh) setSelectedTicket(fresh);
        } else {
          const savedId = sessionStorage.getItem('campusfix_selected_ticket_id');
          if (savedId) {
            const fresh = mapped.find((m) => m._mongoId === savedId || m.id === savedId);
            if (fresh) setSelectedTicket(fresh);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openTicket = (t) => {
    setSelectedTicket(t);
    if (t) {
      sessionStorage.setItem('campusfix_selected_ticket_id', t._mongoId || t.id || '');
    }
    go('detail');
  };

  const loadNotifications = async () => {
    if (!localStorage.getItem('campusfix_token')) return;
    try {
      const res = await api.getNotifications();
      if (res.notifications) setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadTickets();
      loadNotifications();
      // Gentle polling for live background notifications (every 20s)
      const interval = setInterval(() => {
        loadNotifications();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [currentUser, page]);

  const logout = () => {
    localStorage.removeItem('campusfix_token');
    localStorage.removeItem('campusfix_user');
    setCurrentUser(null);
    go('landing');
    setTicketList([]);
    notify('You have been signed out.');
  };

  const role = currentUser?.role || 'student';
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const isStudent = role === 'student' || role === 'faculty';

  const visibleNav = isStudent
    ? [
        { id: 'dashboard', label: 'My overview', icon: 'dashboard' },
        { id: 'tickets', label: 'My issues', icon: 'tickets' },
        { id: 'report', label: 'Report an issue', icon: 'add' }
      ]
    : isStaff
    ? [
        { id: 'dashboard', label: 'My work queue', icon: 'dashboard' },
        { id: 'tickets', label: 'Assigned issues', icon: 'tickets' },
        { id: 'team', label: 'Team workload', icon: 'team' }
      ]
    : navItems;

  const title =
    page === 'dashboard'
      ? isStudent
        ? `Welcome, ${currentUser?.name?.split(' ')[0] || 'Student'}`
        : isStaff
        ? `Work Queue — ${currentUser?.name || 'Staff'}`
        : `Campus Overview — ${currentUser?.name || 'Admin'}`
      : page === 'tickets'
      ? isStudent
        ? 'My reported issues'
        : isStaff
        ? 'Assigned issues'
        : 'All campus issues'
      : page === 'report'
      ? 'Report an issue'
      : page === 'team'
      ? 'Team & workload'
      : page === 'analytics'
      ? 'Campus analytics'
      : 'Issue details';

  const subtitle =
    page === 'dashboard'
      ? isStudent
        ? 'Track your campus reports and see real resolution progress.'
        : isStaff
        ? 'Focus on assigned tasks and update resolution progress.'
        : 'Campus-wide operations, active tickets, and team workload.'
      : page === 'report'
      ? 'Tell us what happened. We will assign the right facilities team.'
      : 'Centralized smart campus issue reporting and resolution.';

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((curr) => curr.map((n) => ({ ...n, isRead: true })));
      notify('All notifications marked as read.');
    } catch (err) {
      notify(err.message);
    }
  };

  const handleOpenNotification = async (n) => {
    try {
      if (!n.isRead) {
        await api.markNotificationRead(n._id);
        setNotifications((curr) => curr.map((item) => (item._id === n._id ? { ...item, isRead: true } : item)));
      }
      setNotifOpen(false);
      if (n.ticketId?._id || n.ticketId) {
        const tId = n.ticketId._id || n.ticketId;
        const target = ticketList.find((t) => t._mongoId === tId);
        if (target) {
          openTicket(target);
        } else {
          go('tickets');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If not logged in
  if (!currentUser) {
    if (page === 'login') {
      return (
        <>
          <AuthLogin
            onLogin={(user) => {
              setCurrentUser(user);
              go('dashboard');
              notify(`Signed in as ${user.name} (${user.role}).`);
            }}
            onBack={() => go('landing')}
            onOpenRegister={() => setRegisterModalOpen(true)}
            onOpenForgot={() => setForgotModalOpen(true)}
          />
          {registerModalOpen && (
            <RegisterModal
              onClose={() => setRegisterModalOpen(false)}
              onRegistered={(user) => {
                setRegisterModalOpen(false);
                setCurrentUser(user);
                go('dashboard');
                notify(`Welcome to CampusFix, ${user.name}!`);
              }}
            />
          )}
          {forgotModalOpen && <ForgotModal onClose={() => setForgotModalOpen(false)} />}
        </>
      );
    }
    return (
      <>
        <Landing
          onStart={() => go('login')}
          onOpenDemoHelp={() => setForgotModalOpen(true)}
        />
        {forgotModalOpen && <ForgotModal onClose={() => setForgotModalOpen(false)} />}
      </>
    );
  }

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <button className="brand" onClick={() => go('dashboard')} title="CampusFix Workspace">
          <CampusFixLogo theme="dark" showTagline />
        </button>
        <div className="workspace-label">
          {isAdmin ? 'ADMINISTRATOR WORKSPACE' : isStaff ? 'MAINTENANCE WORKSPACE' : 'STUDENT WORKSPACE'}
        </div>
        <nav>
          {visibleNav.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
            >
              <i>{icons[item.icon]}</i>
              {item.label}
              {item.id === 'tickets' && <b>{ticketList.length}</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setNotifOpen(!notifOpen)}>
            <i>{icons.bell}</i>Notifications
            {unreadCount > 0 && <b className="dot-count">{unreadCount}</b>}
          </button>
          <button className="nav-item" onClick={() => setHelpModalOpen(true)}>
            <i>?</i>Campus Help & FAQs
          </button>
          <button className="nav-item" onClick={logout}>
            <i>{icons.logout}</i>Sign out
          </button>
          <div className="profile-card">
            <div className={`avatar ${isAdmin ? 'purple' : isStaff ? 'blue' : 'green'}`}>
              {currentUser.name
                .split(' ')
                .map((x) => x[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <strong>{currentUser.name}</strong>
              <small>
                {currentUser.department || (isAdmin ? 'Facilities' : isStaff ? 'Maintenance' : 'Student')}
              </small>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)} />}

      {/* Main Content Area */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {icons.menu}
          </button>
          <div className="mobile-logo">
            <CampusFixLogo theme="light" />
          </div>

          <div className="global-search">
            <i>{icons.search}</i>
            <input
              id="globalSearchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') go('tickets');
              }}
              placeholder="Search complaints, rooms, categories, or ticket IDs… (Press Enter)"
            />
            <kbd>⌘ K</kbd>
          </div>

          <div className="top-actions">
            <button
              className="help"
              onClick={() => setHelpModalOpen(true)}
              title="Campus Support & Hotline"
            >
              ?
            </button>

            {/* Notification Bell */}
            <div className="notif-container">
              <button
                className="notification"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
              >
                {icons.bell}
                {unreadCount > 0 && <em />}
              </button>

              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <h4>Notifications ({unreadCount} unread)</h4>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead}>Mark all read</button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length ? (
                      notifications.map((n) => (
                        <button
                          key={n._id}
                          className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                          onClick={() => handleOpenNotification(n)}
                        >
                          <div className="notif-icon">
                            {n.type === 'assignment' ? (
                              <Icons.team size={14} />
                            ) : n.type === 'reopen' ? (
                              <Icons.arrow size={14} />
                            ) : (
                              <Icons.tickets size={14} />
                            )}
                          </div>
                          <div className="notif-content">
                            <strong>{n.title}</strong>
                            <p>{n.message}</p>
                            <time>
                              {new Date(n.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </time>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="notif-empty">No notifications yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User Pill & Sign Out */}
            <div className="user-topbar-pill">
              <div className={`avatar ${isAdmin ? 'purple' : isStaff ? 'blue' : 'green'}`} style={{ width: 24, height: 24, fontSize: 9 }}>
                {currentUser.name
                  .split(' ')
                  .map((x) => x[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                {currentUser.name}
              </span>
              <span className={`user-role-badge ${currentUser.role}`}>{currentUser.role}</span>
              <button className="btn-logout" onClick={logout} title="Sign out">
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <section className="page-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                }).toUpperCase()}
              </p>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {page !== 'report' && page !== 'dashboard' && isStudent && (
              <button className="primary" onClick={() => go('report')}>
                <span>+</span> Report an issue
              </button>
            )}
            {page !== 'report' && isAdmin && (
              <button className="primary" onClick={() => go('report')}>
                <span>+</span> Log campus issue
              </button>
            )}
          </div>

          {/* Views */}
          {page === 'dashboard' &&
            (isStudent ? (
              <StudentDashboard
                user={currentUser}
                tickets={ticketList}
                onOpen={openTicket}
                onPage={go}
              />
            ) : isStaff ? (
              <StaffDashboard
                user={currentUser}
                tickets={ticketList}
                onOpen={openTicket}
                onPage={go}
              />
            ) : (
              <AdminDashboard
                user={currentUser}
                tickets={ticketList}
                onOpen={openTicket}
                onPage={go}
              />
            ))}

          {page === 'tickets' && (
            <TicketsView
              list={ticketList}
              query={query}
              role={role}
              onClearSearch={() => setQuery('')}
              onOpen={openTicket}
              onRefresh={loadTickets}
            />
          )}

          {page === 'report' && (
            <ReportView
              onSubmitted={(newTicket) => {
                const mapped = toViewTicket(newTicket);
                setTicketList((curr) => [mapped, ...curr.filter((t) => t._mongoId !== mapped._mongoId)]);
                setSelectedTicket(mapped);
                sessionStorage.setItem('campusfix_selected_ticket_id', mapped._mongoId || mapped.id || '');
                go('detail');
                notify(`Issue submitted! Ticket ${newTicket.ticketCode} is now active.`);
                loadTickets();
              }}
              onOpenExisting={(existingTicket) => {
                const mapped = toViewTicket(existingTicket);
                setSelectedTicket(mapped);
                sessionStorage.setItem('campusfix_selected_ticket_id', mapped._mongoId || mapped.id || '');
                go('detail');
              }}
              onNotify={notify}
              onCancel={() => go('tickets')}
            />
          )}

          {page === 'detail' &&
            (selectedTicket ? (
              <DetailView
                ticket={selectedTicket}
                currentUser={currentUser}
                onBack={() => {
                  setSelectedTicket(null);
                  sessionStorage.removeItem('campusfix_selected_ticket_id');
                  go('tickets');
                }}
                onNotify={notify}
                onRefresh={loadTickets}
                onPreviewImage={(src) => setLightboxImage(src)}
              />
            ) : (
              <div className="panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>▤</div>
                <h3 style={{ fontSize: 18, color: '#1e293b', marginBottom: 6 }}>No issue selected</h3>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
                  Select a ticket from the issues list or report a new one.
                </p>
                <button className="primary" onClick={() => go('tickets')}>
                  View All Campus Issues
                </button>
              </div>
            ))}

          {page === 'team' && (
            <TeamView
              currentUser={currentUser}
              onNotify={notify}
              onRefreshTickets={loadTickets}
            />
          )}

          {page === 'analytics' && <AnalyticsView />}
        </section>
      </main>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-overlay" onClick={() => setLightboxImage(null)}>
          <div className="modal-card" style={{ maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setLightboxImage(null)}>
              ×
            </button>
            <h3 style={{ margin: '0 0 15px', font: '600 16px Outfit' }}>Photo Attachment Preview</h3>
            <img
              src={lightboxImage}
              alt="Issue visual proof"
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 8 }}
            />
          </div>
        </div>
      )}

      {/* Campus Help & FAQs Modal */}
      {helpModalOpen && (
        <div className="modal-overlay" onClick={() => setHelpModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setHelpModalOpen(false)}>
              ×
            </button>
            <h3 style={{ margin: '0 0 8px', font: '600 18px Outfit' }}>Campus Infrastructure Support</h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', lineHeight: 1.6 }}>
              CampusFix coordinates with university facilities, IT infrastructure, and safety teams.
            </p>
            <div style={{ display: 'grid', gap: 10, fontSize: 12 }}>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#1e293b' }}>Facilities Admin Office</strong>
                <p style={{ margin: '3px 0', color: '#64748b' }}>Admin Block · Ground Floor, Room 102</p>
                <small style={{ color: '#2563eb' }}>Email: help@campusfix.edu · Ext: 2004</small>
              </div>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#1e293b' }}>Campus Security & Emergency</strong>
                <p style={{ margin: '3px 0', color: '#64748b' }}>24/7 Rapid Response Dispatch</p>
                <small style={{ color: '#dc2626' }}>Emergency Hotline: Ext. 100 / 999</small>
              </div>
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#1e293b' }}>Maintenance Shift Hours</strong>
                <p style={{ margin: '3px 0', color: '#64748b' }}>Mon – Sat: 8:00 AM – 7:00 PM</p>
                <small style={{ color: '#059669' }}>High/Critical issues dispatched within 60 minutes.</small>
              </div>
            </div>
            <button className="primary wide" style={{ marginTop: 20 }} onClick={() => setHelpModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast popup */}
      {toast && (
        <div className="toast">
          <span>{icons.check}</span>
          {toast}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// LANDING PAGE
// -------------------------------------------------------------
function Landing({ onStart, onOpenDemoHelp }) {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="CampusFix Home">
          <CampusFixLogo theme="light" showTagline />
        </button>
        <div>
          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How it works
          </a>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Features
          </a>
          <button className="signin" onClick={onStart} type="button">
            Sign in
          </button>
          <button className="primary" onClick={onStart} type="button">
            Get started <span>→</span>
          </button>
        </div>
      </nav>
      <main>
        <section className="hero">
          <div className="hero-campus-backdrop" aria-hidden="true">
            <img
              src="/assets/landing-campus-quad-4k.jpg"
              alt="Collegiate University Quadrangle"
              className="hero-campus-bg-img"
              onError={(e) => {
                e.currentTarget.src = '/assets/campus-hero-panoramic-4k.jpg';
              }}
            />
            <div className="hero-campus-overlay" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">A BETTER CAMPUS, ONE FIX AT A TIME</p>
            <h1>
              Report issues.
              <br />
              <em>See real change.</em>
            </h1>
            <p className="hero-text">
              CampusFix brings students, administrators, and maintenance teams together to make campus problem-solving clear, quick, and accountable.
            </p>
            <div className="hero-actions">
              <button className="primary large" onClick={onStart} type="button">
                Report an issue <span>→</span>
              </button>
              <button
                className="watch"
                type="button"
                onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <i>▶</i> See how it works
              </button>
            </div>
            <div className="hero-proof">
              <div className="avatars">
                <i>AA</i>
                <i>PS</i>
                <i>NR</i>
                <i>+</i>
              </div>
              <span>
                Trusted by <b>2,000+ students</b>
                <br />
                across their campus
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="floating-card card-ticket">
              <span className="mini-icon">⚡</span>
              <div>
                <small>NEW ISSUE</small>
                <strong>Projector issue in C-204</strong>
                <p>
                  <i /> Assigned to facilities
                </p>
              </div>
            </div>
            <div className="mock-browser">
              <div className="mock-head">
                <span />
                <span />
                <span />
                <b>campusfix</b>
                <i>⌕</i>
                <i>🔔</i>
              </div>
              <div className="mock-content">
                <aside>
                  <strong>
                    campus<span>fix</span>
                  </strong>
                  <small>WORKSPACE</small>
                  <em># Overview</em>
                  <em># All issues</em>
                  <em>+ Report an issue</em>
                  <em>⚡ Analytics</em>
                </aside>
                <section>
                  <p>GOOD MORNING, RIYA</p>
                  <h3>Here's your campus at a glance.</h3>
                  <div className="mock-stats">
                    <b>
                      24<small>Open issues</small>
                    </b>
                    <b>
                      7<small>Need attention</small>
                    </b>
                    <b>
                      128<small>Resolved</small>
                    </b>
                  </div>
                  <div className="mock-panel">
                    <strong>Issues needing attention</strong>
                    <div />
                    <div />
                  </div>
                </section>
              </div>
            </div>
            <div className="floating-card card-resolved">
              <span>
                <Icons.check size={16} />
              </span>
              <div>
                <small>JUST RESOLVED</small>
                <strong>Wi-Fi restored in Hostel B</strong>
                <p>18 mins ago</p>
              </div>
            </div>
          </div>
        </section>

        <section className="value-strip" id="features">
          <div>
            <b>78%</b>
            <span>
              issues resolved
              <br />
              within 24 hours
            </span>
          </div>
          <div>
            <b>18.4h</b>
            <span>
              average resolution
              <br />
              time
            </span>
          </div>
          <div>
            <b>100%</b>
            <span>
              transparent issue
              <br />
              tracking
            </span>
          </div>
          <p>Built for campuses that care about the everyday experience.</p>
        </section>

        <section className="how" id="how">
          <p className="eyebrow">SIMPLE FROM START TO FIX</p>
          <h2>One clear path to a better campus.</h2>
          <div className="steps">
            <article>
              <i>01</i>
              <span>
                <Icons.spark size={18} />
              </span>
              <h3>Report the issue</h3>
              <p>
                Describe what happened, pin the location, and add a photo if it helps.
              </p>
            </article>
            <article>
              <i>02</i>
              <span>
                <Icons.clock size={18} />
              </span>
              <h3>Track every update</h3>
              <p>
                Watch your issue move from report to assignment to resolution.
              </p>
            </article>
            <article>
              <i>03</i>
              <span>
                <Icons.check size={18} />
              </span>
              <h3>See the difference</h3>
              <p>
                Get notified when work is complete and share your feedback.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #edf0f5', padding: '24px 20px', textAlign: 'center', color: '#64748b', fontSize: 13, background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, color: '#1e293b' }}>campus<span style={{ color: '#2563eb' }}>fix</span></span>
            <span>· Smart University Facilities & Infrastructure Resolution</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              type="button"
              onClick={onOpenDemoHelp}
              style={{ background: 'none', border: 0, color: '#2563eb', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
            >
              Demo Accounts & Help
            </button>
            <button
              type="button"
              onClick={onStart}
              style={{ background: 'none', border: 0, color: '#1e293b', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
            >
              Sign In →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------
// AUTHENTICATION LOGIN COMPONENT
// -------------------------------------------------------------
function AuthLogin({ onLogin, onBack, onOpenRegister, onOpenForgot }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  const roleLabels = {
    student: 'Student / Faculty',
    admin: 'Administrator',
    staff: 'Maintenance staff'
  };

  const demoAccounts = [
    {
      name: 'Aasish Student',
      email: 'aasish@campusfix.edu',
      role: 'student',
      dept: 'Computer Science & Engineering',
      color: 'green',
      initials: 'AS'
    },
    {
      name: 'Riya Sharma',
      email: 'riya@campusfix.edu',
      role: 'admin',
      dept: 'Facilities Operations Head',
      color: 'purple',
      initials: 'RS'
    },
    {
      name: 'Arjun Kumar',
      email: 'arjun@campusfix.edu',
      role: 'staff',
      dept: 'Electrical & Equipment Specialist',
      color: 'blue',
      initials: 'AK'
    },
    {
      name: 'Nikhil Rao',
      email: 'nikhil@campusfix.edu',
      role: 'staff',
      dept: 'Plumbing & Water Systems',
      color: 'teal',
      initials: 'NR'
    },
    {
      name: 'Anita Devi',
      email: 'anita@campusfix.edu',
      role: 'staff',
      dept: 'Sanitation & Housekeeping',
      color: 'orange',
      initials: 'AD'
    },
    {
      name: 'Priya Sharma',
      email: 'priya@campusfix.edu',
      role: 'staff',
      dept: 'Network & IT Infrastructure',
      color: 'indigo',
      initials: 'PS'
    }
  ];

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleTabChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleSelectDemo = (acc) => {
    setEmail(acc.email);
    setPassword('CampusFix@123');
    setRole(acc.role);
    setError('');
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const targetEmail = email.trim() || (role === 'student' ? 'aasish@campusfix.edu' : role === 'admin' ? 'riya@campusfix.edu' : 'arjun@campusfix.edu');
      const targetPassword = password || 'CampusFix@123';
      const res = await api.login(targetEmail, targetPassword, role);
      localStorage.setItem('campusfix_token', res.token);
      localStorage.setItem('campusfix_user', JSON.stringify(res.user));
      onLogin(res.user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setBusy(false);
    }
  };

  // Filter accounts for current tab first, or all if typing
  const visibleSuggestions = email
    ? demoAccounts.filter(
        (a) =>
          a.email.toLowerCase().includes(email.toLowerCase()) ||
          a.name.toLowerCase().includes(email.toLowerCase())
      )
    : demoAccounts;

  return (
    <div className="auth-page">
      <div className="auth-art">
        <button className="brand" onClick={onBack} type="button" title="Back to home">
          <CampusFixLogo theme="dark" size="large" showTagline />
        </button>
        <div className="auth-art-headline">
          <p className="eyebrow">CAMPUS OPERATIONS, SIMPLIFIED</p>
          <h1>
            Every issue
            <br />
            deserves a <em>clear</em>
            <br />
            <em>path.</em>
          </h1>
          <p>
            Use the correct workspace for your CampusFix account.
          </p>
        </div>
        <div className="auth-quote">
          “I can finally see what is happening with the issues I report.”
          <span>— Aasish, Computer Science</span>
        </div>

        {/* Modern Warm University Visual — Bottom-Right Corner Only */}
        <div className="auth-campus-corner" aria-hidden="true">
          <img
            src="/assets/auth-campus-corner-warm.jpg"
            alt="Modern University Campus Architecture"
            className="auth-campus-corner-img"
            onError={(e) => {
              e.currentTarget.src = '/assets/campus-hero-panoramic-4k.jpg';
            }}
          />
          <div className="auth-campus-corner-gradient" />
          <div className="auth-campus-corner-badge">
            <span className="corner-badge-dot pulse" />
            <span>VFSTR Main Campus</span>
          </div>
        </div>
      </div>

      <section className="auth-form">
        <div>
          <button className="back" onClick={onBack} type="button">
            ← Back to home
          </button>
          <h1>Welcome back</h1>
          <p>Select your account type, then sign in securely.</p>

          {/* Quick Demo Fill Chips */}
          <div className="demo-quick-chips-bar">
            <span className="demo-chip-label">
              <Icons.spark size={13} /> 1-Click Fill:
            </span>
            <button
              type="button"
              className="demo-pill-chip"
              onClick={() => handleSelectDemo(demoAccounts[0])}
              title="Auto-fill Aasish Student"
            >
              <span className="chip-dot green" /> Student
            </button>
            <button
              type="button"
              className="demo-pill-chip"
              onClick={() => handleSelectDemo(demoAccounts[1])}
              title="Auto-fill Riya Sharma (Admin)"
            >
              <span className="chip-dot purple" /> Admin
            </button>
            <button
              type="button"
              className="demo-pill-chip"
              onClick={() => handleSelectDemo(demoAccounts[2])}
              title="Auto-fill Arjun Kumar (Staff - Electrical)"
            >
              <span className="chip-dot blue" /> Staff (Arjun)
            </button>
            <button
              type="button"
              className="demo-pill-chip"
              onClick={() => handleSelectDemo(demoAccounts[3])}
              title="Auto-fill Nikhil Rao (Staff - Plumbing)"
            >
              <span className="chip-dot blue" /> Staff (Nikhil)
            </button>
            <button
              type="button"
              className="demo-pill-chip"
              onClick={() => handleSelectDemo(demoAccounts[4])}
              title="Auto-fill Anita Devi (Staff - Sanitation)"
            >
              <span className="chip-dot blue" /> Staff (Anita)
            </button>
          </div>

          {/* Role Selection Tabs */}
          <div className="role-tabs">
            {Object.entries(roleLabels).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={role === key ? 'active' : ''}
                onClick={() => handleRoleTabChange(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              University email
              <div className="auth-input-wrapper" ref={dropdownRef}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="you@university.edu (click for demo accounts)"
                  autoComplete="off"
                />

                {/* Interactive Demo Suggestions Popover */}
                {showSuggestions && (
                  <div className="demo-dropdown-suggestions">
                    <div className="demo-suggestions-header">
                      <span>
                        <Icons.spark size={12} /> Suggested Demo Accounts
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSuggestions(false);
                        }}
                      >
                        ✕ Close
                      </button>
                    </div>

                    {visibleSuggestions.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        className={`demo-suggestion-item ${email === acc.email ? 'active' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectDemo(acc);
                        }}
                      >
                        <div className={`suggestion-avatar ${acc.color}`}>
                          {acc.initials}
                        </div>
                        <div className="demo-suggestion-info">
                          <strong>
                            {acc.name}
                            <span className={`demo-suggestion-badge ${acc.role}`}>
                              {acc.role}
                            </span>
                          </strong>
                          <small>{acc.email} · {acc.dept}</small>
                        </div>
                        <span className="demo-suggestion-action">Auto-fill ↵</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <label>
              Password
              <div className="password">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button className="primary wide" disabled={busy} type="submit" style={{ marginTop: 24 }}>
              {busy ? 'Signing in…' : `Sign in as ${roleLabels[role]} →`}
            </button>
          </form>

          <p className="signup">
            New student or faculty?{' '}
            <button type="button" onClick={onOpenRegister}>
              Create an account
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// REGISTRATION MODAL
// -------------------------------------------------------------
function RegisterModal({ onClose, onRegistered }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Computer Science',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all required fields.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await api.register(form);
      localStorage.setItem('campusfix_token', res.token);
      localStorage.setItem('campusfix_user', JSON.stringify(res.user));
      onRegistered(res.user);
    } catch (err) {
      setError(err.message || 'Registration failed.');
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 style={{ margin: '0 0 6px', font: '600 20px Outfit' }}>Create an Account</h2>
        <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 16px' }}>
          Register as a student or faculty member to report and track campus issues.
        </p>

        {error && <p className="auth-error" style={{ margin: '0 0 12px' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="form-card" style={{ border: 0, padding: 0 }}>
          <label>
            Full Name
            <input
              name="name"
              value={form.name}
              onChange={update}
              placeholder="e.g. John Doe"
              required
            />
          </label>
          <label>
            University Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="e.g. john@university.edu"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              placeholder="Choose a password (min 6 chars)"
              required
            />
          </label>
          <div className="form-grid" style={{ marginTop: 10 }}>
            <label>
              Role
              <select name="role" value={form.role} onChange={update}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </label>
            <label>
              Department
              <input
                name="department"
                value={form.department}
                onChange={update}
                placeholder="e.g. Computer Science"
              />
            </label>
          </div>
          <button className="primary wide" disabled={busy} type="submit" style={{ marginTop: 20 }}>
            {busy ? 'Registering…' : 'Complete Registration →'}
          </button>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// FORGOT PASSWORD / DEMO CREDENTIALS MODAL
// -------------------------------------------------------------
function ForgotModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3 style={{ margin: '0 0 8px', font: '600 18px Outfit' }}>CampusFix Demo Accounts</h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', lineHeight: 1.5 }}>
          All seeded accounts share the password: <code>CampusFix@123</code>. You can sign in with any of these:
        </p>
        <div style={{ display: 'grid', gap: 10, fontSize: 12 }}>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#7c3aed' }}>Administrator:</strong> riya@campusfix.edu
            <br />
            <small style={{ color: '#64748b' }}>Role: Admin (Full dashboard, staff assignment, analytics)</small>
          </div>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#16a34a' }}>Student:</strong> aasish@campusfix.edu
            <br />
            <small style={{ color: '#64748b' }}>Role: Student (Report issues, track progress, give feedback)</small>
          </div>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0284c7' }}>Maintenance Staff:</strong> arjun@campusfix.edu
            <br />
            <small style={{ color: '#64748b' }}>Role: Staff (View assigned queue, update progress, resolve tickets)</small>
          </div>
        </div>
        <button className="primary wide" style={{ marginTop: 18 }} onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// STUDENT & HERO ILLUSTRATION COMPONENTS
// -------------------------------------------------------------
function StudentIllustrationSvg() {
  return (
    <svg viewBox="0 0 260 170" className="student-illu-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blue chair */}
      <rect x="180" y="55" width="34" height="75" rx="17" fill="#1d4ed8" />
      <rect x="168" y="85" width="56" height="45" rx="10" fill="#2563eb" />
      
      {/* Speech alert bubble with ! */}
      <g className="illu-bubble-group">
        <circle cx="196" cy="30" r="15" fill="#ffffff" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))" />
        <path d="M191 42 L187 47 L197 43 Z" fill="#ffffff" />
        <rect x="194.5" y="21" width="3" height="10" rx="1.5" fill="#1d4ed8" />
        <circle cx="196" cy="35" r="1.6" fill="#1d4ed8" />
      </g>

      {/* Student body & yellow hoodie */}
      <g className="illu-student-group">
        <rect x="142" y="66" width="14" height="16" fill="#f6ad55" rx="3" />
        <ellipse cx="149" cy="52" rx="15" ry="17" fill="#fbd38d" />
        <circle cx="163" cy="54" r="4" fill="#fbd38d" />
        <ellipse cx="155" cy="51" rx="1.8" ry="2.2" fill="#0f172a" />
        <path d="M158 55 Q156 59 153 58" stroke="#dd6b20" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M151 62 Q155 65 158 62" stroke="#c05621" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M134 48 C134 37 145 31 159 34 C167 37 170 43 168 50 C166 47 162 43 155 44 C146 45 141 49 134 48 Z" fill="#0f172a" />
        <path d="M136 48 C132 57 139 63 141 63 C140 58 139 53 141 50 Z" fill="#0f172a" />

        <path d="M126 84 C133 75 141 71 149 71 C157 71 166 75 173 84 L185 130 C185 130 171 140 149 140 C127 140 114 130 114 130 L126 84 Z" fill="#f59e0b" />
        <path d="M135 75 C140 82 158 82 163 75 C166 82 162 90 149 90 C136 90 132 82 135 75 Z" fill="#d97706" />
        <line x1="144" y1="87" x2="143" y2="108" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="154" y1="87" x2="155" y2="108" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />

        <path d="M123 90 L96 120 C96 120 102 126 110 125 L133 105 Z" fill="#fbbf24" />
        <path d="M172 90 L151 124 L138 120 L161 95 Z" fill="#d97706" />
        <circle cx="97" cy="123" r="5.5" fill="#fbd38d" />
        <circle cx="138" cy="123" r="5.5" fill="#fbd38d" />
      </g>

      {/* Dark modern desk & laptop */}
      <g className="illu-desk-laptop">
        <rect x="15" y="132" width="225" height="7" rx="3.5" fill="#0b172e" />
        <polygon points="48,72 114,72 110,123 42,123" fill="#1e293b" />
        <polygon points="51,75 111,75 108,120 46,120" fill="#0f172a" />
        <circle cx="78" cy="96" r="3.8" fill="#60a5fa" opacity="0.85" />
        <polygon points="38,123 120,123 130,132 28,132" fill="#334155" />
        <line x1="52" y1="127" x2="108" y2="127" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function ReportIssueCard({ onReport }) {
  return (
    <article
      className="report-issue-pro-card"
      onClick={onReport}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onReport();
        }
      }}
      title="Click to report a new campus issue"
    >
      <div className="report-pro-backdrop">
        <img
          src="/assets/student-issue-card-4k.jpg"
          alt="Report a New Campus Issue"
          className="report-pro-bg-img"
          onError={(e) => {
            e.currentTarget.src = '/assets/student-issue-hero.jpg';
          }}
        />
        <div className="report-pro-gradient-overlay" />
      </div>
      <div className="report-pro-content">
        <div className="report-pro-wrench-badge">
          <Icons.wrench size={22} />
        </div>
        <h3 className="report-pro-title">Report a New Issue</h3>
        <p className="report-pro-sub">
          Help us maintain a better campus environment.
        </p>
        <button
          className="report-pro-pill-btn"
          onClick={(e) => {
            e.stopPropagation();
            onReport();
          }}
        >
          <span>Report Issue</span> <span className="pill-arrow">→</span>
        </button>
      </div>
    </article>
  );
}

function PanoramicCampusBanner({ user, onReport }) {
  return (
    <section className="campus-panoramic-hero vignan-daylight-hero">
      <div className="panoramic-backdrop">
        <img
          src="/assets/campus-hero-panoramic-4k.jpg"
          alt="Vignan University (VFSTR) Campus"
          className="panoramic-img"
          onError={(e) => {
            e.currentTarget.src = '/assets/vignan-university-seamless.jpg';
          }}
        />
        <div className="panoramic-daylight-gradient" />
      </div>
      <div className="panoramic-content daylight-content">
        <h1 className="panoramic-title daylight-title">Welcome to CampusFix!</h1>
        <p className="panoramic-sub daylight-sub">
          Report campus issues easily and track their resolution in real-time.
        </p>
        <div className="panoramic-actions">
          <button className="panoramic-btn-pill-blue" onClick={onReport}>
            <span>Report a New Issue</span> <span className="pill-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// STUDENT DASHBOARD
// -------------------------------------------------------------
function StudentDashboard({ user, tickets, onOpen, onPage }) {
  const activeReports = tickets.filter((t) => !['Resolved', 'Closed'].includes(t.status));
  const awaitingReview = tickets.filter((t) => t.status === 'Submitted' || t.status === 'Under Review');
  const inProgressReports = tickets.filter((t) => t.status === 'In Progress');
  const resolvedReports = tickets.filter((t) => ['Resolved', 'Closed'].includes(t.status));
  const totalComplaints = tickets.length;

  const needsFeedback = resolvedReports.length > 0;

  return (
    <>
      {/* Collegiate Panoramic Campus Banner (Image 6) */}
      <PanoramicCampusBanner user={user} onReport={() => onPage('report')} />

      {/* 4 Modern Wave KPI Cards (Image 7) */}
      <div className="metrics student-metrics-4col">
        <Metric
          icon={<Icons.tickets size={20} />}
          tone="blue"
          label="Total Complaints"
          value={totalComplaints}
          change="↑ 12%"
          detail="All submitted reports"
        />
        <Metric
          icon={<Icons.check size={20} />}
          tone="green"
          label="Resolved"
          value={resolvedReports.length}
          change="↑ 8%"
          detail="Completed fixes"
        />
        <Metric
          icon={<Icons.clock size={20} />}
          tone="orange"
          label="In Progress"
          value={inProgressReports.length}
          change="↓ 1%"
          detail="Technicians on-site"
        />
        <Metric
          icon={<Icons.alert size={20} />}
          tone="purple"
          label="Pending"
          value={awaitingReview.length}
          change="↓ 0%"
          detail="Awaiting review"
          warn={awaitingReview.length > 0}
        />
      </div>

      <div className="dashboard-grid student-grid">
        <section className="panel recent">
          <PanelTitle
            title="My recent complaints"
            link="View all my reports"
            onClick={() => onPage('tickets')}
          />
          <div className="ticket-list">
            {tickets.length ? (
              tickets.slice(0, 4).map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} onClick={() => onOpen(ticket)} />
              ))
            ) : (
              <div className="empty" style={{ padding: 30 }}>
                <strong>No reports yet</strong>
                <p>Have an issue in your classroom or hostel? Report it above!</p>
              </div>
            )}
          </div>
        </section>

        {/* Upgraded Hero Report Issue Card (Image 4) */}
        <ReportIssueCard onReport={() => onPage('report')} />
      </div>

      {needsFeedback && (
        <section className="feedback-banner">
          <div>
            <span>
              <Icons.star size={22} fill="#f59e0b" />
            </span>
            <div>
              <strong>Share your repair feedback</strong>
              <p>
                Did our maintenance team resolve your issue satisfactorily? Open your resolved ticket
                to submit a 5-star rating!
              </p>
            </div>
          </div>
          <button onClick={() => onOpen(resolvedReports[0])}>Rate repair quality →</button>
        </section>
      )}
    </>
  );
}

// -------------------------------------------------------------
// MAINTENANCE STAFF DASHBOARD
// -------------------------------------------------------------
function StaffDashboard({ user, tickets, onOpen, onPage }) {
  const assigned = tickets.filter((t) => !['Resolved', 'Closed'].includes(t.status));
  const dueToday = assigned.filter((t) => t.priority === 'Critical' || t.priority === 'High');
  const completed = tickets.filter((t) => ['Resolved', 'Closed'].includes(t.status));

  return (
    <>
      <section className="staff-focus">
        <div>
          <p className="eyebrow">TODAY’S TASK QUEUE</p>
          <h2>
            You have {assigned.length} tasks assigned to you ({dueToday.length} high priority).
          </h2>
          <p>Prioritize critical electrical and equipment failures before routine items.</p>
        </div>
        <button className="outline" onClick={() => onPage('tickets')}>
          View all assigned work →
        </button>
      </section>

      <div className="metrics student-metrics-4col">
        <Metric
          icon={<Icons.tickets size={20} />}
          tone="blue"
          label="Assigned to me"
          value={assigned.length}
          change="↑ 12%"
          detail="active work orders"
        />
        <Metric
          icon={<Icons.clock size={20} />}
          tone="orange"
          label="High / Critical"
          value={dueToday.length}
          change="↓ 1%"
          detail="needs prompt fix"
          warn={dueToday.length > 0}
        />
        <Metric
          icon={<Icons.check size={20} />}
          tone="green"
          label="Completed by me"
          value={completed.length}
          change="↑ 8%"
          detail="resolved tickets"
        />
        <Metric
          icon={<Icons.star size={20} fill="#f59e0b" />}
          tone="purple"
          label="Technician Rating"
          value="4.9 ★"
          change="Top tier"
          detail="student satisfaction"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel recent">
          <PanelTitle
            title="Your Priority Queue"
            link="See full queue"
            onClick={() => onPage('tickets')}
          />
          <div className="ticket-list">
            {assigned.length ? (
              assigned.map((t) => (
                <TicketRow key={t.id} ticket={t} onClick={() => onOpen(t)} />
              ))
            ) : (
              <div className="empty" style={{ padding: 30 }}>
                <strong>No active tasks in your queue!</strong>
                <p>Check back when new issues are assigned by administration.</p>
              </div>
            )}
          </div>
        </section>

        <section className="panel schedule">
          <PanelTitle title="Today's On-Site Tasks" />
          {assigned.length ? (
            assigned.slice(0, 5).map((t, idx) => {
              const times = ['09:30 AM', '11:15 AM', '02:00 PM', '03:45 PM', '05:00 PM'];
              return (
                <div
                  className="schedule-row"
                  key={t.id || idx}
                  onClick={() => onOpen(t)}
                  style={{ cursor: 'pointer' }}
                  title="Click to view task details"
                >
                  <time>{times[idx % times.length]}</time>
                  <span />
                  <div>
                    <strong>{t.location || 'Campus'}</strong>
                    <small>{t.title} · {t.priority} priority</small>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty" style={{ padding: 20 }}>
              <p style={{ margin: 0, color: '#8894a6', fontSize: 13 }}>No active tasks in your queue.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// INTERACTIVE DATA VISUALIZATIONS & CHARTS
// -------------------------------------------------------------
function InteractiveResolutionChart({ tickets = [], monthlyData }) {
  const [timeframe, setTimeframe] = useState('6m');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const dynamicData = useMemo(() => {
    if (monthlyData && Array.isArray(monthlyData) && monthlyData.length > 0) {
      return monthlyData;
    }
    if (tickets && tickets.length > 0) {
      const monthMap = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      tickets.forEach((t) => {
        const d = t.createdAt ? new Date(t.createdAt) : new Date();
        const mKey = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthMap[mKey]) {
          monthMap[mKey] = {
            label: monthNames[d.getMonth()],
            year: d.getFullYear(),
            month: d.getMonth(),
            total: 0,
            resolved: 0
          };
        }
        monthMap[mKey].total += 1;
        if (t.status === 'Resolved' || t.status === 'Closed') {
          monthMap[mKey].resolved += 1;
        }
      });
      const sorted = Object.values(monthMap).sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
      return sorted.map((s) => ({
        ...s,
        rate: s.total ? Math.round((s.resolved / s.total) * 100) : 0
      }));
    }
    return [{ label: 'Nov', total: 8, resolved: 7, rate: 88 }];
  }, [tickets, monthlyData]);

  const months6 = useMemo(() => {
    return dynamicData.length >= 6 ? dynamicData.slice(-6) : dynamicData;
  }, [dynamicData]);

  const monthsYear = dynamicData;

  const data = timeframe === '6m' ? months6 : monthsYear;
  const activeItem = hoveredIdx !== null ? data[hoveredIdx] : (data[data.length - 1] || { label: 'Nov', total: 0, resolved: 0, rate: 100 });

  return (
    <div className="interactive-chart-container">
      <div className="chart-timeframe-header">
        <div className="trend-head" style={{ marginBottom: 0 }}>
          <div>
            <strong>{activeItem.rate}%</strong>
            <span>completion ({activeItem.resolved}/{activeItem.total} resolved)</span>
          </div>
          <span className="good">
            <Icons.check size={13} /> {activeItem.label}: SLA Met
          </span>
        </div>
        <div className="chart-pills-row">
          <button
            type="button"
            className={`chart-pill-btn ${timeframe === '6m' ? 'active' : ''}`}
            onClick={() => { setTimeframe('6m'); setHoveredIdx(null); }}
          >
            Last 6 Months
          </button>
          <button
            type="button"
            className={`chart-pill-btn ${timeframe === '1y' ? 'active' : ''}`}
            onClick={() => { setTimeframe('1y'); setHoveredIdx(null); }}
          >
            Full Year 2026
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '140px', marginTop: '10px' }}>
        <svg
          viewBox={`0 0 ${data.length * 52} 125`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="20" x2={data.length * 52} y2="20" stroke="#f1f5f9" strokeDasharray="3,3" />
          <line x1="0" y1="60" x2={data.length * 52} y2="60" stroke="#f1f5f9" strokeDasharray="3,3" />
          <line x1="0" y1="100" x2={data.length * 52} y2="100" stroke="#e2e8f0" strokeWidth="1" />

          {data.map((item, idx) => {
            const barWidth = 26;
            const x = idx * 52 + (52 - barWidth) / 2;
            const barHeight = (item.rate / 100) * 85;
            const y = 100 - barHeight;
            const isHovered = hoveredIdx === idx || (hoveredIdx === null && idx === data.length - 1);

            return (
              <g
                key={item.label}
                className="chart-hover-col"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background hover capture area */}
                <rect
                  x={idx * 52}
                  y="0"
                  width="52"
                  height="125"
                  fill={isHovered ? 'rgba(59, 130, 246, 0.08)' : 'transparent'}
                  rx="4"
                />
                {/* Main bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  fill={isHovered ? 'url(#barGradHover)' : 'url(#barGrad)'}
                  style={{
                    filter: isHovered ? 'drop-shadow(0 4px 6px rgba(37,99,235,0.35))' : 'none',
                    transition: 'all 0.18s ease'
                  }}
                />
                {/* Month label */}
                <text
                  x={idx * 52 + 26}
                  y="118"
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? '#0f172a' : '#64748b'}
                  fontWeight={isHovered ? '700' : '500'}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
        <span>Hover over any month bar to inspect detailed resolution metrics</span>
        <span style={{ fontWeight: 600, color: '#2563eb' }}>Campus SLA Target: 90%</span>
      </div>
    </div>
  );
}

function InteractiveCategoryDonut({ tickets, onSelectCategory }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = useMemo(() => {
    const list = [
      { name: 'Classroom Equipment', color: '#3b82f6' },
      { name: 'Electrical', color: '#8b5cf6' },
      { name: 'Plumbing', color: '#10b981' },
      { name: 'Internet / Network', color: '#f59e0b' },
      { name: 'Furniture', color: '#ec4899' },
      { name: 'Sanitation', color: '#06b6d4' }
    ];

    const total = tickets.length || 1;
    return list.map((cat) => {
      const count = tickets.filter((t) => t.category === cat.name).length;
      const pct = Math.round((count / total) * 100);
      return { ...cat, count, pct };
    }).filter((cat) => cat.count > 0 || cat.name === 'Classroom Equipment' || cat.name === 'Electrical');
  }, [tickets]);

  const total = tickets.length;
  const currentCat = activeCategory
    ? categories.find((c) => c.name === activeCategory) || categories[0]
    : null;

  let accumulatedPct = 0;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="interactive-donut-container">
      <div className="donut-svg-wrapper">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="16" />
          {categories.map((cat) => {
            const pct = (cat.count / Math.max(1, total)) * 100;
            const strokeDash = `${(pct / 100) * circumference} ${circumference}`;
            const strokeOffset = -((accumulatedPct / 100) * circumference);
            accumulatedPct += pct;
            const isHovered = activeCategory === cat.name;

            return (
              <circle
                key={cat.name}
                className="donut-segment-arc"
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={cat.color}
                strokeWidth={isHovered ? 20 : 16}
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                onMouseEnter={() => setActiveCategory(cat.name)}
                onMouseLeave={() => setActiveCategory(null)}
              />
            );
          })}
        </svg>

        <div className="donut-center-info">
          {currentCat ? (
            <>
              <strong>{currentCat.count}</strong>
              <span style={{ color: currentCat.color, fontWeight: 700 }}>{currentCat.pct}%</span>
            </>
          ) : (
            <>
              <strong>{total}</strong>
              <span>Total Issues</span>
            </>
          )}
        </div>
      </div>

      <div className="donut-interactive-legend">
        {categories.map((cat) => {
          const isHighlighted = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              className={`donut-legend-item ${isHighlighted ? 'highlighted' : ''}`}
              onMouseEnter={() => setActiveCategory(cat.name)}
              onMouseLeave={() => setActiveCategory(null)}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="legend-bullet" style={{ background: cat.color }} />
                <span>{cat.name}</span>
              </div>
              <strong style={{ color: isHighlighted ? cat.color : '#475569' }}>
                {cat.count} ({cat.pct}%)
              </strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SatisfactionScoreCard({ analytics }) {
  const avg = analytics?.satisfaction?.avgRating || '4.9';
  const totalReviews = analytics?.satisfaction?.totalReviews || 8;
  const satRate = analytics?.satisfaction?.satisfactionRate || 96;

  return (
    <div className="satisfaction-score-card">
      <div className="score-circle">
        <strong>{avg}</strong>
        <span>★ RATING</span>
      </div>
      <div className="score-details">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <h4>Verified Student Satisfaction</h4>
          <span className="verified-student-badge">
            <Icons.check size={11} /> High Approval
          </span>
        </div>
        <p>
          <b>{satRate}% of students</b> rated completed repairs as 4 or 5 stars ({totalReviews} verified post-resolution ratings).
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
          <div className="gold-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <Icons.star key={s} size={15} fill="#f59e0b" />
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>
            {avg} / 5.0 Average Campus Sentiment
          </span>
        </div>
      </div>
    </div>
  );
}

function InteractiveBuildingBreakdown({ tickets = [], data = [], onSelectBuilding }) {
  const buildings = useMemo(() => {
    if (data && data.length > 0) {
      const maxCount = Math.max(...data.map((d) => d.count), 1);
      return data.map((d) => ({
        name: d._id || 'Campus Area',
        count: d.count,
        pct: Math.round((d.count / maxCount) * 100)
      }));
    }
    const list = ['C Block', 'A Block', 'B Block', 'Central Library', 'Hostel Block'];
    const total = tickets.length || 1;
    return list.map((b) => {
      const count = tickets.filter((t) => (t.location || '').toLowerCase().includes(b.split(' ')[0].toLowerCase())).length;
      return { name: b, count, pct: Math.round((count / total) * 100) };
    });
  }, [tickets, data]);

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

  return (
    <div style={{ marginTop: 10 }}>
      {buildings.map((b, i) => (
        <div
          key={b.name}
          className="interactive-building-row"
          onClick={() => onSelectBuilding && onSelectBuilding(b.name)}
          title={`Click to view complaints in ${b.name}`}
        >
          <span>{b.name}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${Math.max(15, b.pct * 2)}%`,
                background: colors[i % colors.length]
              }}
            />
          </div>
          <b>{b.count}</b>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// ADMINISTRATOR DASHBOARD
// -------------------------------------------------------------
function AdminDashboard({ user, tickets, onOpen, onPage }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.getAnalytics()
      .then((res) => setAnalytics(res))
      .catch((err) => console.error(err));
  }, [tickets]);

  const total = tickets.length;
  const unassigned = tickets.filter((t) => !t.assignee && !['Resolved', 'Closed'].includes(t.status));
  const openCount = tickets.filter((t) => !['Resolved', 'Closed'].includes(t.status)).length;
  const resolvedCount = tickets.filter((t) => ['Resolved', 'Closed'].includes(t.status)).length;
  const rate = total ? Math.round((resolvedCount / total) * 100) : 0;

  // Real calculation of average resolution time from timestamps
  const avgResolutionHours = useMemo(() => {
    const resolved = tickets.filter((t) => t.resolvedAt && t.createdAt);
    if (!resolved.length) return '16.5h';
    const totalMs = resolved.reduce((acc, t) => acc + Math.max(0, new Date(t.resolvedAt) - new Date(t.createdAt)), 0);
    const hrs = (totalMs / (resolved.length * 3600 * 1000)).toFixed(1);
    return `${hrs}h`;
  }, [tickets]);

  // Real staff workload calculations
  const staffList = [
    { name: 'Arjun Kumar', role: 'Electrical & Equipment', initials: 'AK', color: 'blue' },
    { name: 'Nikhil Rao', role: 'Plumbing & Water Systems', initials: 'NR', color: 'orange' },
    { name: 'Priya Sharma', role: 'Network & IT Infrastructure', initials: 'PS', color: 'purple' },
    { name: 'Anita Devi', role: 'Sanitation & Housekeeping', initials: 'AD', color: 'green' }
  ].map((staff) => {
    const activeTasks = tickets.filter(
      (t) => t.assignee?.includes(staff.name.split(' ')[0]) && !['Resolved', 'Closed'].includes(t.status)
    ).length;
    const pct = Math.min(100, activeTasks * 25);
    return { ...staff, jobs: `${activeTasks} active issues`, pct };
  });

  return (
    <>
      <PanoramicCampusBanner user={user} onReport={() => onPage('report')} />

      <div className="metrics student-metrics-4col">
        <Metric
          icon={<Icons.tickets size={20} />}
          tone="blue"
          label="Total Complaints"
          value={total}
          change="↑ 12%"
          detail="Across all campus blocks"
        />
        <Metric
          icon={<Icons.check size={20} />}
          tone="green"
          label="Resolved"
          value={resolvedCount}
          change="↑ 8%"
          detail={`${rate}% overall resolution`}
        />
        <Metric
          icon={<Icons.clock size={20} />}
          tone="orange"
          label="In Progress"
          value={tickets.filter((t) => t.status === 'In Progress').length}
          change="↓ 1%"
          detail="Technicians on-site"
        />
        <Metric
          icon={<Icons.alert size={20} />}
          tone="purple"
          label="Pending"
          value={unassigned.length}
          change="↓ 0%"
          detail="Need technician assigned"
          warn={unassigned.length > 0}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel recent">
          <div className="panel-title-with-filter">
            <div className="panel-title-left">
              <span className="panel-bell-icon">🔔</span>
              <h2>Recent Campus Reports</h2>
            </div>
            <button className="panel-sub-link" onClick={() => onPage('tickets')}>View all →</button>
          </div>
          <div className="ticket-list">
            {tickets.slice(0, 4).map((ticket) => (
              <TicketRow key={ticket.id} ticket={ticket} onClick={() => onOpen(ticket)} />
            ))}
          </div>
        </section>

        <section className="panel trend">
          <div className="panel-title-with-filter">
            <div className="panel-title-left">
              <span className="panel-bar-icon">📊</span>
              <h2>Complaint Overview</h2>
            </div>
            <select className="overview-time-select" defaultValue="6m">
              <option value="1m">Last 30 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          <InteractiveResolutionChart tickets={tickets} monthlyData={analytics?.monthlyResolution} />
        </section>

        <section className="panel categories">
          <div className="panel-title-with-filter">
            <div className="panel-title-left">
              <span className="panel-bar-icon">📊</span>
              <h2>Top Issue Categories</h2>
            </div>
            <button className="panel-sub-link" onClick={() => onPage('tickets')}>Manage →</button>
          </div>
          <InteractiveCategoryDonut
            tickets={tickets}
            onSelectCategory={() => onPage('tickets')}
          />
        </section>

        <section className="panel workload">
          <PanelTitle title="Maintenance Team Workload" link="Manage team" onClick={() => onPage('team')} />
          <div className="people">
            {staffList.map((p) => (
              <Person
                key={p.name}
                name={p.name}
                role={p.role}
                initials={p.initials}
                color={p.color}
                jobs={p.jobs}
                pct={p.pct}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Verified Student Satisfaction Card */}
      <SatisfactionScoreCard analytics={analytics} />

      <section className="insight" style={{ marginTop: 18 }}>
        <span className="insight-icon">{icons.spark}</span>
        <div>
          <strong>Campus Operations Pulse</strong>
          <p>
            Classroom equipment and electrical complaints are highest in <b>C Block</b> and <b>A Block</b>. Ensure maintenance supplies are restocked.
          </p>
        </div>
        <button onClick={() => onPage('analytics')}>View insights {icons.arrow}</button>
      </section>
    </>
  );
}

// -------------------------------------------------------------
// TICKETS LIST VIEW (WITH FILTERING & SORTING)
// -------------------------------------------------------------
function TicketsView({ list, query, role, onClearSearch, onOpen, onRefresh }) {
  const [tab, setTab] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const counts = useMemo(() => {
    return {
      all: list.length,
      open: list.filter((t) => ['Submitted', 'Assigned', 'Reopened'].includes(t.status)).length,
      inProgress: list.filter((t) => ['Assigned', 'In progress'].includes(t.status)).length,
      resolved: list.filter((t) => ['Resolved', 'Closed'].includes(t.status)).length
    };
  }, [list]);

  const filtered = useMemo(() => {
    return list
      .filter((t) => {
        if (tab === 'Open') return ['Submitted', 'Assigned', 'Reopened'].includes(t.status);
        if (tab === 'In progress') return ['Assigned', 'In progress'].includes(t.status);
        if (tab === 'Resolved') return ['Resolved', 'Closed'].includes(t.status);
        return true;
      })
      .filter((t) => (categoryFilter ? t.category === categoryFilter : true))
      .filter((t) => (priorityFilter ? t.priority === priorityFilter : true))
      .filter((t) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          t.title?.toLowerCase().includes(q) ||
          t.id?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'priority') {
          const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        return 0;
      });
  }, [list, tab, categoryFilter, priorityFilter, query, sortBy]);

  const hasActiveFilters = categoryFilter || priorityFilter || query || tab !== 'All';

  const clearAllFilters = () => {
    setCategoryFilter('');
    setPriorityFilter('');
    setTab('All');
    onClearSearch();
  };

  return (
    <>
      <div className="filters">
        <div className="filter-tabs">
          <button
            className={tab === 'All' ? 'selected' : ''}
            onClick={() => setTab('All')}
          >
            All <b>{counts.all}</b>
          </button>
          <button
            className={tab === 'Open' ? 'selected' : ''}
            onClick={() => setTab('Open')}
          >
            Open <b>{counts.open}</b>
          </button>
          <button
            className={tab === 'In progress' ? 'selected' : ''}
            onClick={() => setTab('In progress')}
          >
            In progress <b>{counts.inProgress}</b>
          </button>
          <button
            className={tab === 'Resolved' ? 'selected' : ''}
            onClick={() => setTab('Resolved')}
          >
            Resolved <b>{counts.resolved}</b>
          </button>
        </div>

        <div className="filter-controls-row">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option>Classroom Equipment</option>
            <option>Electrical</option>
            <option>Internet / Network</option>
            <option>Plumbing</option>
            <option>Furniture</option>
            <option>Sanitation</option>
            <option>Other</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Highest priority</option>
          </select>

          {hasActiveFilters && (
            <button
              className="outline"
              style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              onClick={clearAllFilters}
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>

      <section className="panel table-panel">
        <div className="table-header">
          <span>Issue</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Assigned to</span>
          <span>Updated</span>
          <span />
        </div>
        {filtered.length ? (
          filtered.map((ticket) => (
            <button
              className="table-row"
              onClick={() => onOpen(ticket)}
              key={ticket.id}
            >
              <div>
                <div className="ticket-title-row">
                  <strong>{ticket.title}</strong>
                  {ticket.images && ticket.images.length > 0 && (
                    <span className="photo-attached-badge" title="Visual photo evidence attached">
                      <img src={ticket.images[0]} className="tiny-ticket-thumb" alt="Evidence thumbnail" />
                      Photo
                    </span>
                  )}
                  {(ticket.feedback?.rating || ticket.rating) && (
                    <span className="satisfaction-star-pill" title={`Verified Student Rating: ${ticket.feedback?.rating || ticket.rating}.0 / 5.0`}>
                      ★ {ticket.feedback?.rating || ticket.rating}.0
                    </span>
                  )}
                </div>
                <small>
                  {ticket.id} · {ticket.category} · {ticket.location}
                </small>
              </div>
              <span className={`priority ${ticket.priority.toLowerCase()}`}>
                {ticket.priority}
              </span>
              <span className={statusClass(ticket.status)}>{ticket.status}</span>
              <span className="assignee">
                {ticket.avatar && <i>{ticket.avatar}</i>}
                {ticket.assignee || 'Unassigned'}
              </span>
              <time>{ticket.date}</time>
              <span>
                <Icons.arrow size={14} />
              </span>
            </button>
          ))
        ) : (
          <div className="empty">
            <div>
              <Icons.search size={28} />
            </div>
            <strong>No complaints match your criteria</strong>
            <p>Try clearing filters or adjusting your search query.</p>
          </div>
        )}
      </section>
    </>
  );
}

// Helper for fast, client-side canvas image downscaling to prevent payload limit errors
function compressImageFile(file, maxWidth = 1280, quality = 0.75) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// REPORT AN ISSUE VIEW (WITH DUPLICATE DETECTION & PHOTO UPLOAD)
// -------------------------------------------------------------
function ReportView({ onSubmitted, onOpenExisting, onNotify, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    building: '',
    location: '',
    description: '',
    priority: 'Medium'
  });
  const [images, setImages] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [busy, setBusy] = useState(false);

  const update = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    if (updated.building && updated.category) {
      api.checkDuplicates({
        building: updated.building,
        category: updated.category,
        title: updated.title
      })
        .then((res) => {
          if (res.duplicates) setDuplicates(res.duplicates);
        })
        .catch(() => {});
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const compressedList = await Promise.all(files.map((f) => compressImageFile(f)));
      const valid = compressedList.filter(Boolean);
      setImages((curr) => [...curr, ...valid]);
    } catch (err) {
      console.error('Image compression error:', err);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((curr) => curr.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.building || !form.location.trim() || !form.description.trim()) {
      onNotify('Please complete all required fields.');
      return;
    }

    setBusy(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        building: form.building,
        location: `${form.building} • ${form.location.trim()}`,
        description: form.description.trim(),
        priority: form.priority || 'Medium',
        images
      };
      const res = await api.createTicket(payload);
      if (res && res.ticket) {
        onSubmitted(res.ticket);
      } else {
        throw new Error('Ticket could not be created.');
      }
    } catch (err) {
      onNotify(err.message || 'Failed to submit complaint.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="report-layout">
      <form className="panel form-card" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Issue details</h2>
          <p>Provide complete information so maintenance can bring the right tools.</p>

          <label>
            What is the issue?
            <input
              name="title"
              value={form.title}
              onChange={update}
              placeholder="e.g. Projector in C-204 not turning on"
              required
            />
          </label>

          <div className="form-grid">
            <label>
              Category
              <select name="category" value={form.category} onChange={update} required>
                <option value="">Choose category</option>
                <option>Classroom Equipment</option>
                <option>Electrical</option>
                <option>Internet / Network</option>
                <option>Plumbing</option>
                <option>Furniture</option>
                <option>Sanitation</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Priority
              <select name="priority" value={form.priority} onChange={update}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
          </div>

          <label>
            Detailed Description
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              placeholder="Describe what is failing, any error messages, and when it started..."
              required
            />
          </label>
        </div>

        <div className="form-section">
          <h2>Location</h2>
          <p>Where is this issue located on campus?</p>
          <div className="form-grid">
            <label>
              Building / Block
              <select name="building" value={form.building} onChange={update} required>
                <option value="">Select building</option>
                <option>A Block</option>
                <option>B Block</option>
                <option>C Block</option>
                <option>Central Library</option>
                <option>Hostel Block</option>
              </select>
            </label>
            <label>
              Room or Specific Spot
              <input
                name="location"
                value={form.location}
                onChange={update}
                placeholder="e.g. Room 204, 2nd floor"
                required
              />
            </label>
          </div>

          {/* DUPLICATE COMPLAINT WARNING */}
          {duplicates.length > 0 && (
            <div className="duplicate-warning" style={{ marginTop: 16 }}>
              <div className="duplicate-warning-head">
                <Icons.spark size={16} />
                <span>Potential Existing Complaints in {form.building}</span>
              </div>
              <p>
                We found {duplicates.length} open issue(s) in this category/building. Review them to avoid duplicate submissions:
              </p>
              {duplicates.map((d) => (
                <div key={d._id} className="duplicate-item">
                  <div>
                    <strong>{d.ticketCode}: {d.title}</strong>
                    <span style={{ display: 'block', fontSize: 10, color: '#64748b' }}>
                      {d.location} • Status: {d.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className={`badge ${d.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {d.status}
                    </span>
                    <button
                      type="button"
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        borderRadius: 4,
                        padding: '4px 8px',
                        fontSize: 10,
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => onOpenExisting && onOpenExisting(d)}
                    >
                      View Issue →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>
            Visual Evidence <small>Optional</small>
          </h2>
          <p>Attach photos of the damaged area to accelerate repair diagnosis.</p>

          <label className="dropzone">
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <span><Icons.tickets size={24} /></span>
            <strong>
              Click to select or <b>drag images here</b>
            </strong>
            <small>PNG, JPG up to 10MB each (auto-compressed)</small>
          </label>

          {images.length > 0 && (
            <div className="image-preview-grid">
              {images.map((imgSrc, idx) => (
                <div key={idx} className="image-preview-thumb">
                  <img src={imgSrc} alt="Preview thumbnail" />
                  <button type="button" onClick={() => handleRemoveImage(idx)} title="Remove photo">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary" type="submit" disabled={busy}>
            {busy ? 'Submitting issue...' : 'Submit Issue'} <Icons.chevronRight size={14} />
          </button>
        </div>
      </form>

      <aside className="report-help">
        <div className="tip-card">
          <span>
            <Icons.spark size={20} />
          </span>
          <h3>Smart duplicate detection</h3>
          <p>
            CampusFix scans open tickets in the same building and category as you type to prevent duplicate work orders.
          </p>
        </div>
        <div className="support-card">
          <span>
            <Icons.help size={20} />
          </span>
          <div>
            <strong>Campus Emergency?</strong>
            <p>For urgent electrical or water line ruptures, alert Campus Security immediately.</p>
            <a href="tel:100">Contact Facilities Hotline</a>
          </div>
        </div>
      </aside>
    </div>
  );
}

// -------------------------------------------------------------
// ISSUE DETAIL VIEW (ACTIVITY TIMELINE, FEEDBACK, STAFF ASSIGNMENT)
// -------------------------------------------------------------
function DetailView({ ticket, currentUser, onBack, onNotify, onRefresh, onPreviewImage }) {
  const [status, setStatus] = useState(ticket.status);
  const [assignee, setAssignee] = useState(ticket.assignee || '');
  const [priority, setPriority] = useState(ticket.priority);
  const [note, setNote] = useState('');
  const [activities, setActivities] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeEvidenceImage, setActiveEvidenceImage] = useState(ticket.images?.[0] || null);

  const isAdmin = currentUser.role === 'admin';
  const isStaff = currentUser.role === 'staff';
  const isOwner =
    String(ticket.createdBy?._id || ticket.createdBy?.id || ticket.createdBy) ===
    String(currentUser._id || currentUser.id);

  const loadActivitiesAndFeedback = async () => {
    try {
      const [actRes, ticketRes] = await Promise.all([
        api.getActivities(ticket._mongoId),
        api.getTicket(ticket._mongoId)
      ]);
      if (actRes.activities) setActivities(actRes.activities);
      if (ticketRes.feedback) setFeedback(ticketRes.feedback);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssigneeChange = (val) => {
    setAssignee(val);
    if (val && val !== 'Unassigned' && (status === 'Submitted' || status === 'Reopened')) {
      setStatus('Assigned');
    }
  };

  useEffect(() => {
    setStatus(ticket.status);
    setAssignee(ticket.assignee || '');
    setPriority(ticket.priority);
    setNote('');
    setActiveEvidenceImage(ticket.images?.[0] || null);
    loadActivitiesAndFeedback();
    if (isAdmin) {
      api.getStaffList()
        .then((res) => {
          if (res.staff) setStaffOptions(res.staff);
        })
        .catch(() => {});
    }
  }, [ticket._mongoId, ticket.id, ticket.status, ticket.assignee, ticket.priority]);

  const handleSaveUpdates = async () => {
    setBusy(true);
    try {
      const payload = {
        status,
        ...(isAdmin ? { assignee: assignee || null, priority } : {}),
        ...(isStaff ? { resolutionNote: note } : {}),
        note
      };
      const res = await api.updateTicket(ticket._mongoId, payload);
      onNotify('Ticket updates saved and recorded to timeline.');
      setNote('');
      if (res && res.ticket) {
        setStatus(res.ticket.status);
        if (res.ticket.assignedTo) {
          setAssignee(res.ticket.assignedTo.name || res.ticket.assignedTo);
        } else {
          setAssignee('');
        }
      }
      loadActivitiesAndFeedback();
      onRefresh();
    } catch (err) {
      onNotify(err.message || 'Failed to save updates.');
    } finally {
      setBusy(false);
    }
  };

  const handleReopen = async () => {
    setBusy(true);
    try {
      await api.reopenTicket(ticket._mongoId, 'Issue still unresolved after technician visit.');
      onNotify('Ticket reopened and escalated to Facilities.');
      setStatus('Reopened');
      loadActivitiesAndFeedback();
      onRefresh();
    } catch (err) {
      onNotify(err.message || 'Failed to reopen ticket.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.submitFeedback(ticket._mongoId, {
        rating,
        comment: feedbackComment
      });
      setFeedback(res.feedback);
      onNotify('Feedback submitted! Thank you for rating the service.');
      loadActivitiesAndFeedback();
    } catch (err) {
      onNotify(err.message || 'Failed to submit feedback.');
    } finally {
      setBusy(false);
    }
  };

  const isResolvedOrClosed = ['Resolved', 'Closed'].includes(status);

  return (
    <>
      <button className="back" onClick={onBack}>
        ← Back to all issues
      </button>

      <div className="detail-grid">
        <section>
          {/* Main Card */}
          <article className="panel issue-card">
            <div className="detail-top">
              <div>
                <div className="detail-id">{ticket.id}</div>
                <h2>{ticket.title}</h2>
                <p className="location">
                  <Icons.pin size={14} /> {ticket.location}
                </p>
              </div>
              <span className={`priority ${priority.toLowerCase()}`}>{priority} priority</span>
            </div>

            {/* Stepper */}
            <div className="status-stepper">
              <Step label="Submitted" done />
              <Step
                label="Assigned"
                done={Boolean(ticket.assignee || assignee)}
                active={status === 'Assigned'}
              />
              <Step
                label="In progress"
                active={status === 'In progress'}
                done={['Resolved', 'Closed'].includes(status)}
              />
              <Step
                label="Resolved"
                active={status === 'Resolved'}
                done={status === 'Closed'}
              />
            </div>

            {/* PROBLEM DESCRIPTION AND VISUAL EVIDENCE SIDE-BY-SIDE */}
            <div className="problem-and-evidence-grid">
              <div className="problem-details-col">
                <div className="problem-badges">
                  <span className="badge category-badge">{ticket.category}</span>
                  <span className={`priority ${priority.toLowerCase()}`}>{priority} priority</span>
                  <span className={statusClass(status)}>{status}</span>
                </div>

                <div className="issue-description-box">
                  <h3>Detailed Complaint</h3>
                  <p>{ticket.description}</p>
                </div>

                {ticket.resolutionNote && (
                  <div className="resolution-note-callout">
                    <div className="resolution-header">
                      <Icons.check size={16} />
                      <strong>Technician Resolution Note:</strong>
                    </div>
                    <p>{ticket.resolutionNote}</p>
                  </div>
                )}
              </div>

              {/* VISUAL EVIDENCE RIGHT BESIDE THE PROBLEM */}
              <div className="visual-evidence-col">
                <div className="evidence-header">
                  <h4>Visual Evidence ({ticket.images?.length || 0})</h4>
                  {ticket.images?.length > 0 && (
                    <span className="verified-proof-tag">
                      <Icons.check size={12} /> Verified proof
                    </span>
                  )}
                </div>

                {ticket.images && ticket.images.length > 0 ? (
                  <div className="evidence-gallery">
                    <div
                      className="evidence-featured-image"
                      onClick={() => onPreviewImage(activeEvidenceImage || ticket.images[0])}
                      title="Click to view high-resolution photo"
                    >
                      <img
                        src={activeEvidenceImage || ticket.images[0]}
                        alt="Complaint visual proof"
                      />
                      <div className="zoom-hint-badge">
                        <Icons.search size={12} /> Click to expand photo
                      </div>
                    </div>

                    {ticket.images.length > 1 && (
                      <div className="evidence-thumbnails-strip">
                        {ticket.images.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`thumb-btn ${(activeEvidenceImage || ticket.images[0]) === img ? 'active' : ''}`}
                            onClick={() => setActiveEvidenceImage(img)}
                          >
                            <img src={img} alt={`Thumbnail ${idx + 1}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-evidence-box">
                    <Icons.image size={32} />
                    <strong>No photo attached</strong>
                    <p>This complaint was submitted with written text description.</p>
                  </div>
                )}
              </div>
            </div>

            {/* STUDENT SATISFACTION VERIFIED RATING SYSTEM */}
            {isResolvedOrClosed && (
              <>
                {feedback ? (
                  <div className="student-satisfaction-card">
                    <div className="satisfaction-card-header">
                      <div className="star-display-large">
                        <div className="gold-stars">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Icons.star
                              key={s}
                              size={20}
                              fill={s <= feedback.rating ? '#f59e0b' : '#e2e8f0'}
                            />
                          ))}
                        </div>
                        <strong>{feedback.rating}.0 / 5.0</strong>
                        <span className="verified-student-badge">
                          <Icons.check size={11} /> Verified Student Review
                        </span>
                      </div>
                      <span className="satisfaction-label">
                        {feedback.rating >= 4 ? 'Satisfactory Service' : 'Needs Follow-up'}
                      </span>
                    </div>

                    {feedback.comment ? (
                      <blockquote className="satisfaction-quote">
                        “{feedback.comment}”
                      </blockquote>
                    ) : (
                      <p className="satisfaction-no-comment">Student gave a {feedback.rating}-star rating without written remarks.</p>
                    )}

                    <div className="satisfaction-footer">
                      <small>
                        Reviewed on{' '}
                        {new Date(feedback.updatedAt || feedback.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </small>
                    </div>
                  </div>
                ) : isOwner ? (
                  <div className="feedback-box">
                    <h4>How satisfied are you with this repair?</h4>
                    <p>Share your rating to verify resolution quality across campus.</p>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={(hoverRating || rating) >= s ? 'active' : ''}
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Icons.star
                            size={22}
                            fill={(hoverRating || rating) >= s ? '#f59e0b' : '#cbd5e1'}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Optional remarks: Was the problem solved completely? Did the technician arrive promptly?"
                    />
                    <button
                      className="primary"
                      type="button"
                      disabled={busy}
                      onClick={handleSubmitFeedback}
                    >
                      {busy ? 'Submitting…' : 'Submit Service Rating →'}
                    </button>
                  </div>
                ) : (
                  <div className="pending-satisfaction-notice">
                    <Icons.star size={16} />
                    <span>Awaiting student quality rating. The student reporter can submit their 5-star review at any time.</span>
                  </div>
                )}

                {/* Reopen option for student if issue still broken */}
                {isOwner && (
                  <button className="btn-reopen" type="button" onClick={handleReopen} disabled={busy}>
                    <Icons.arrow size={14} /> Reopen issue (Problem not resolved)
                  </button>
                )}
              </>
            )}
          </article>

          {/* Real Activity Timeline */}
          <section className="panel timeline">
            <PanelTitle title="Complaint Activity History" />
            <div>
              {activities.length ? (
                activities.map((act, i) => (
                  <div className="activity" key={act._id || i}>
                    <div className={`activity-dot ${act.action.includes('submitted') ? 'green' : act.action.includes('Assignment') ? 'violet' : act.action.includes('Status') ? 'blue' : 'orange'}`}>
                      {act.performedBy?.name
                        ?.split(' ')
                        .map((x) => x[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'CF'}
                    </div>
                    {i < activities.length - 1 && <i className="activity-line" />}
                    <div>
                      <strong>
                        {act.action} {act.newValue ? `→ ${act.newValue}` : ''}
                      </strong>
                      <p>
                        By {act.performedBy?.name || 'User'} ({act.performedBy?.role || 'Staff'})
                        {act.note ? ` — “${act.note}”` : ''}
                      </p>
                      <small>
                        {new Date(act.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 12, color: '#8894a6' }}>Loading activity history…</p>
              )}
            </div>
          </section>
        </section>

        {/* Right Sidebar Controls */}
        <aside>
          {/* Action card for Admin / Staff */}
          {(isAdmin || isStaff) && (
            <section className="panel action-card">
              <h3>Manage Complaint</h3>

              <label>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {isAdmin ? (
                    <>
                      <option>Submitted</option>
                      <option>Assigned</option>
                      <option>In progress</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </>
                  ) : (
                    <>
                      <option>Assigned</option>
                      <option>In progress</option>
                      <option>Resolved</option>
                    </>
                  )}
                </select>
              </label>

              {isAdmin && (
                <>
                  <label>
                    Assign Maintenance Staff
                    <select value={assignee} onChange={(e) => handleAssigneeChange(e.target.value)}>
                      <option value="">Unassigned</option>
                      {staffOptions.map((s) => (
                        <option key={s._id} value={s.name}>
                          {s.name} ({s.department || 'Staff'})
                        </option>
                      ))}
                      {!staffOptions.length && (
                        <>
                          <option>Arjun Kumar</option>
                          <option>Nikhil Rao</option>
                          <option>Priya Sharma</option>
                          <option>Anita Devi</option>
                        </>
                      )}
                    </select>
                  </label>

                  <label>
                    Priority
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </label>
                </>
              )}

              <label>
                {isStaff ? 'Resolution / Progress Notes' : 'Action Note'}
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isStaff ? 'What was fixed or inspected?' : 'Note for timeline'}
                  style={{ marginTop: 5 }}
                />
              </label>

              <button
                className="primary wide"
                disabled={busy}
                onClick={handleSaveUpdates}
              >
                {busy ? 'Saving…' : 'Save Updates'}
              </button>
            </section>
          )}

          {/* Reporter Details */}
          <section className="panel reporter">
            <p>REPORTED BY</p>
            <div className="reporter-info">
              <div className="avatar green">
                {ticket.reporterName
                  ?.split(' ')
                  .map((x) => x[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'ST'}
              </div>
              <div>
                <strong>{ticket.reporterName}</strong>
                <small>{ticket.reporterDept} · {ticket.reporterRole || 'Student'}</small>
              </div>
            </div>
            {ticket.reporterEmail && (
              <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 6px' }}>
                ✉ {ticket.reporterEmail}
              </p>
            )}
            <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>
              Building: <b>{ticket.building || 'Campus'}</b>
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// TEAM & WORKLOAD VIEW
// -------------------------------------------------------------
function TeamView({ currentUser, onNotify, onRefreshTickets }) {
  const [users, setUsers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const isAdmin = currentUser.role === 'admin';

  const loadUsers = async () => {
    try {
      const res = await api.getUsers('staff');
      if (res.users) setUsers(res.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    if (!isAdmin) return;
    try {
      await api.toggleUserStatus(user._id, !user.isActive);
      onNotify(`Updated active status for ${user.name}.`);
      loadUsers();
    } catch (err) {
      onNotify(err.message);
    }
  };

  return (
    <>
      <div className="team-grid">
        <section className="panel team-list">
          <PanelTitle
            title="Maintenance & Facilities Team"
            link={isAdmin ? '+ Add Staff Member' : null}
            onClick={() => setAddModalOpen(true)}
          />
          {users.length ? (
            users.map((staff) => (
              <div className="staff-row" key={staff._id}>
                <div className="avatar blue">
                  {staff.name
                    .split(' ')
                    .map((x) => x[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <strong>{staff.name}</strong>
                  <small>{staff.department || 'Facilities'}</small>
                </div>
                <div className="staff-load">
                  <span>{staff.email}</span>
                  <div style={{ marginTop: 4 }}>
                    <span
                      className={`badge ${staff.isActive ? 'resolved' : 'closed'}`}
                      style={{ fontSize: 9 }}
                    >
                      {staff.isActive ? 'Active Staff' : 'Deactivated'}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    className={`btn-toggle-active ${staff.isActive ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleStatus(staff)}
                  >
                    {staff.isActive ? 'Active' : 'Deactivated'}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: 12, color: '#8894a6' }}>Loading staff members…</p>
          )}
        </section>

        <section className="panel workload-summary">
          <PanelTitle title="Workload Distribution" />
          <div className="balance-ring">
            <strong>74%</strong>
            <span>team capacity</span>
          </div>
          <p>
            Facilities technicians are assigned by specialization: Electrical, Plumbing, Network, and
            Sanitation. Ensure high-priority classroom issues are addressed first.
          </p>
          <button className="outline" onClick={() => onNotify('Automated assignments balanced.')}>
            Rebalance Workload
          </button>
        </section>
      </div>

      {addModalOpen && (
        <AddStaffModal
          onClose={() => setAddModalOpen(false)}
          onAdded={() => {
            setAddModalOpen(false);
            loadUsers();
            onNotify('New staff member added to maintenance pool.');
          }}
          onNotify={onNotify}
        />
      )}
    </>
  );
}

// -------------------------------------------------------------
// ADD STAFF MODAL
// -------------------------------------------------------------
function AddStaffModal({ onClose, onAdded, onNotify }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'CampusFix@123',
    department: 'Electrical & Equipment'
  });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.createUser({ ...form, role: 'staff' });
      onAdded();
    } catch (err) {
      onNotify(err.message || 'Failed to create staff member.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h3 style={{ margin: '0 0 10px', font: '600 18px Outfit' }}>Add Maintenance Staff</h3>
        <form onSubmit={handleSubmit} className="form-card" style={{ border: 0, padding: 0 }}>
          <label>
            Staff Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ramesh Singh"
              required
            />
          </label>
          <label>
            University Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. ramesh.staff@campusfix.edu"
              required
            />
          </label>
          <label>
            Department / Specialization
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option>Electrical & Equipment</option>
              <option>Plumbing & Water Systems</option>
              <option>Network & IT Infrastructure</option>
              <option>Sanitation & Housekeeping</option>
              <option>General Carpentry & Furniture</option>
            </select>
          </label>
          <button className="primary wide" disabled={busy} type="submit" style={{ marginTop: 20 }}>
            {busy ? 'Adding…' : 'Add Staff Member'}
          </button>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// ANALYTICS VIEW
// -------------------------------------------------------------
function AnalyticsView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="analytics-grid">
      <section className="panel analytics-large">
        <PanelTitle title="Interactive Resolution Performance (Monthly)" />
        <InteractiveResolutionChart monthlyData={data?.monthlyResolution} />
      </section>

      <section className="panel">
        <PanelTitle title="SLA & Resolution Speed" />
        <div className="performance">
          <strong>14.2h</strong>
          <p>Average time to resolution</p>
          <span className="positive">
            <Icons.check size={14} /> 2.1h faster than target SLA
          </span>
        </div>
        <hr />
        <div className="performance">
          <strong>{data ? `${data.resolutionRate}%` : '92%'}</strong>
          <p>Total resolution rate</p>
          <span className="positive">
            <Icons.check size={14} /> High compliance
          </span>
        </div>
        <hr />
        <div className="performance">
          <strong>{data?.satisfaction?.avgRating ? `${data.satisfaction.avgRating} ★` : '4.9 ★'}</strong>
          <p>Student satisfaction score</p>
          <span className="positive">
            <Icons.star size={14} fill="#f59e0b" /> Verified post-repair rating
          </span>
        </div>
      </section>

      <section className="panel analytics-large">
        <PanelTitle title="Top Issue Locations by Campus Building" />
        <InteractiveBuildingBreakdown data={data?.byBuilding} />
      </section>

      {/* Verified Student Satisfaction & Reviews Panel */}
      <section className="panel analytics-large" style={{ gridColumn: '1 / -1' }}>
        <PanelTitle title="Student Satisfaction & Service Quality" />
        <SatisfactionScoreCard analytics={data} />

        {data?.satisfaction?.recentReviews?.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#334155' }}>
              Recent Verified Student Reviews
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {data.satisfaction.recentReviews.map((rev) => (
                <div
                  key={rev._id}
                  style={{
                    background: '#fffdf5',
                    border: '1px solid #fde68a',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div className="gold-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Icons.star
                          key={s}
                          size={13}
                          fill={s <= rev.rating ? '#f59e0b' : '#e2e8f0'}
                        />
                      ))}
                    </div>
                    <span className="verified-student-badge">
                      <Icons.check size={10} /> Verified
                    </span>
                  </div>
                  {rev.comment ? (
                    <p style={{ margin: '4px 0 8px', fontStyle: 'italic', color: '#451a03' }}>
                      "{rev.comment}"
                    </p>
                  ) : (
                    <p style={{ margin: '4px 0 8px', fontStyle: 'italic', color: '#92400e' }}>
                      Rated {rev.rating} stars for prompt facilities service.
                    </p>
                  )}
                  <small style={{ color: '#78350f', display: 'block' }}>
                    {rev.ticketId?.title || 'Campus Complaint'} · {rev.ticketId?.building || 'Campus'}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Real Category Breakdown */}
      {data?.byCategory?.length > 0 && (
        <section className="panel analytics-large" style={{ gridColumn: '1 / -1' }}>
          <PanelTitle title="Live Complaints Breakdown by Category" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginTop: 12 }}>
            {data.byCategory.map((cat, idx) => {
              const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
              return (
                <div
                  key={cat._id}
                  style={{
                    background: '#f8fafc',
                    padding: 14,
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 13, color: '#1e293b', display: 'block' }}>{cat._id}</strong>
                    <small style={{ color: '#64748b' }}>Total filed</small>
                  </div>
                  <strong style={{ fontSize: 20, color: colors[idx % colors.length] }}>{cat.count}</strong>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// REUSABLE HELPER ATOMS
// -------------------------------------------------------------
function MetricWave({ tone = 'blue' }) {
  const configs = {
    blue: {
      stroke: '#3b82f6',
      id: 'waveGradBlue',
      d: 'M0,34 C28,34 44,42 70,36 C96,30 114,14 136,17 C148,19 156,23 160,25',
      area: 'M0,34 C28,34 44,42 70,36 C96,30 114,14 136,17 C148,19 156,23 160,25 L160,46 L0,46 Z',
    },
    green: {
      stroke: '#10b981',
      id: 'waveGradGreen',
      d: 'M0,38 C30,38 52,42 76,28 C100,16 122,14 142,21 C152,24 157,27 160,29',
      area: 'M0,38 C30,38 52,42 76,28 C100,16 122,14 142,21 C152,24 157,27 160,29 L160,46 L0,46 Z',
    },
    orange: {
      stroke: '#f97316',
      id: 'waveGradOrange',
      d: 'M0,40 C34,40 58,44 82,32 C106,20 126,26 140,32 C150,36 156,38 160,39',
      area: 'M0,40 C34,40 58,44 82,32 C106,20 126,26 140,32 C150,36 156,38 160,39 L160,46 L0,46 Z',
    },
    purple: {
      stroke: '#a855f7',
      id: 'waveGradPurple',
      d: 'M0,38 C28,38 48,42 72,34 C95,26 112,18 132,16 C144,15 154,20 160,22',
      area: 'M0,38 C28,38 48,42 72,34 C95,26 112,18 132,16 C144,15 154,20 160,22 L160,46 L0,46 Z',
    },
  };

  const cfg = configs[tone] || configs.blue;

  return (
    <div className="metric-wave-container" aria-hidden="true">
      <svg viewBox="0 0 160 46" preserveAspectRatio="none" className="metric-wave-svg">
        <defs>
          <linearGradient id={cfg.id} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={cfg.stroke} stopOpacity="0.25" />
            <stop offset="100%" stopColor={cfg.stroke} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={cfg.area} fill={`url(#${cfg.id})`} />
        <path d={cfg.d} fill="none" stroke={cfg.stroke} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Metric({ icon, tone = 'blue', label, value, change, detail, warn, trend }) {
  const changeStr = String(change ?? '');
  const isUp = trend === 'up' || changeStr.includes('↑') || changeStr.includes('↗') || changeStr.includes('+') || changeStr === 'Active' || changeStr === 'Completed' || changeStr === 'Good' || changeStr === 'Top tier' || (changeStr.endsWith('%') && !changeStr.startsWith('-'));
  const isDown = trend === 'down' || changeStr.includes('↓') || changeStr.includes('-');

  return (
    <article className={`metric metric-modern tone-${tone} ${warn ? 'has-warn' : ''}`}>
      <div className="metric-head">
        <div className={`metric-icon ${tone}`}>{icon}</div>
        <div className="metric-primary">
          <strong className="metric-val">{value}</strong>
          <p className="metric-lbl">{label}</p>
        </div>
        {changeStr && (
          <div className={`metric-trend-pill ${isDown ? 'trend-down' : isUp ? 'trend-up' : 'trend-neutral'}`}>
            {!changeStr.includes('↑') && !changeStr.includes('↓') && !changeStr.includes('↗') ? (isDown ? '↓ ' : isUp ? '↑ ' : '') : ''}
            {changeStr}
          </div>
        )}
      </div>
      {detail && <div className="metric-footnote">{detail}</div>}
      <MetricWave tone={tone} />
    </article>
  );
}

function PanelTitle({ title, link, onClick }) {
  return (
    <div className="panel-title">
      <h2>{title}</h2>
      {link && <button onClick={onClick}>{link} →</button>}
    </div>
  );
}

function TicketRow({ ticket, onClick }) {
  const catKey = (ticket.category || '').toLowerCase();
  const iconClass = catKey.includes('plumb')
    ? 'plumbing'
    : catKey.includes('net') || catKey.includes('wifi')
    ? 'internet'
    : catKey.includes('furn')
    ? 'furniture'
    : '';

  const rating = ticket.feedback?.rating || ticket.rating;

  return (
    <button className="ticket-row" onClick={onClick}>
      <div className={`category-icon ${iconClass}`}>
        <Icons.tickets size={15} />
      </div>
      <div className="ticket-info">
        <div className="ticket-title-row">
          <strong>{ticket.title}</strong>
          {ticket.images && ticket.images.length > 0 && (
            <span className="photo-attached-badge" title="Visual photo evidence attached">
              <img src={ticket.images[0]} className="tiny-ticket-thumb" alt="Evidence thumbnail" />
              Photo
            </span>
          )}
          {rating && (
            <span className="satisfaction-star-pill" title={`Verified Student Rating: ${rating}.0 / 5.0`}>
              ★ {rating}.0
            </span>
          )}
          <span className={statusClass(ticket.status)}>{ticket.status}</span>
        </div>
        <p>
          {ticket.id} <i>•</i> {ticket.location}
        </p>
      </div>
      <span className={`priority ${(ticket.priority || 'Medium').toLowerCase()}`}>
        {ticket.priority}
      </span>
      <time>{ticket.date}</time>
      <span className="chevron">
        <Icons.arrow size={14} />
      </span>
    </button>
  );
}

function Step({ label, done, active }) {
  return (
    <div className={`${done ? 'done' : ''} ${active ? 'active' : ''}`}>
      <i>{done ? <Icons.check size={11} /> : ''}</i>
      <span>{label}</span>
    </div>
  );
}

function Legend({ color, label, count }) {
  return (
    <div>
      <i style={{ background: color }} />
      <span>{label}</span>
      <b>{count}</b>
    </div>
  );
}

function Person({ initials, color, name, role, jobs, pct }) {
  return (
    <div className="person">
      <div className={`avatar ${color}`}>{initials}</div>
      <div className="person-text">
        <strong>{name}</strong>
        <small>{role}</small>
        <div className="load">
          <i style={{ width: `${pct}%` }} />
        </div>
        <span>{jobs}</span>
      </div>
      <b>{pct}%</b>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
