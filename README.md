# CampusFix — Smart Campus Issue Reporting & Resolution Platform

A centralized MERN-stack platform for university campus infrastructure management. Students and faculty can report infrastructure complaints, campus administrators assign maintenance technicians and monitor resolution rates, and maintenance personnel manage work orders and track repairs.

---

## 🌟 Key Features

1. **Role-Based Workspaces & Secured Authentication**
   - **Student / Faculty Workspace:** Report issues, upload photos, real-time duplicate checking, track complaint progress, submit 5-star feedback ratings, and reopen unresolved issues.
   - **Administrator Workspace:** Campus overview, assign maintenance personnel by specialization, manage priority, toggle staff availability, live analytics, and system-wide complaints management.
   - **Maintenance Staff Workspace:** Daily task queue, priority orders (High / Critical), resolution notes, and status progression (`Assigned` → `In progress` → `Resolved`).

2. **Smart Duplicate Complaint Detection**
   - Automatically scans open issues in the same building and category as a user types or selects a location.
   - Alerts the reporter with active complaint codes to avoid duplicate work orders.

3. **Complete Lifecycle Tracking & Audit Timeline**
   - Stepper: `Submitted` → `Assigned` → `In progress` → `Resolved` → `Closed` (or `Reopened`).
   - Every assignment, status update, priority change, and rating logs an immutable activity entry with timestamps, responsible user, and notes.

4. **Notifications System**
   - Dynamic unread count in header.
   - Interactive popover listing complaint and assignment updates with "Mark all read" and direct link to ticket details.

5. **Feedback & Quality Assurance**
   - Once marked `Resolved`, students can rate repair quality (1 to 5 stars) and leave comments that persist directly into MongoDB.

---

## 👥 Demo Accounts

All seeded demo accounts share the password: `CampusFix@123`.

| Role | Name | Email | Department / Specialization |
| :--- | :--- | :--- | :--- |
| **Administrator** | Riya Sharma | `riya@campusfix.edu` | Facilities Administration |
| **Student** | Aasish Student | `aasish@campusfix.edu` | Computer Science & Engineering |
| **Faculty** | Dr. Ramesh V | `ramesh@campusfix.edu` | Electronics & Communication |
| **Maintenance Staff** | Arjun Kumar | `arjun@campusfix.edu` | Electrical & Equipment |
| **Maintenance Staff** | Nikhil Rao | `nikhil@campusfix.edu` | Plumbing & Water Systems |
| **Maintenance Staff** | Priya Sharma | `priya@campusfix.edu` | Network & IT Infrastructure |
| **Maintenance Staff** | Anita Devi | `anita@campusfix.edu` | Sanitation & Housekeeping |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Backend Server Setup
```bash
cd server
npm install
# Seed demo accounts, tickets, activity timeline, and notifications:
npm run seed
# Start API server on port 5000:
npm start
```

### 2. Frontend Client Setup
```bash
cd client
npm install
# Start Vite development server on port 5173:
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

---

## 📡 REST API Summary (`/api/v1`)

### Authentication (`/auth`)
- `POST /auth/register` — Create a student/faculty account
- `POST /auth/login` — Sign in with role validation
- `GET  /auth/me` — Verify session token
- `PATCH /auth/profile` — Update name or department

### Complaints & Tickets (`/tickets`)
- `GET   /tickets` — List complaints (filtered by role, status, priority, category, query)
- `GET   /tickets/:id` — Complaint details and feedback
- `POST  /tickets` — Submit a new campus complaint
- `PATCH /tickets/:id` — Update status, staff assignment, priority, or resolution note
- `POST  /tickets/:id/reopen` — Reopen an issue
- `POST  /tickets/:id/feedback` — Submit 1-5 star rating and comment
- `GET   /tickets/:id/activities` — Full activity timeline
- `GET   /tickets/check-duplicates` — Real-time duplicate checking
- `GET   /tickets/staff-list` — Active maintenance staff roster

### Administration (`/admin`)
- `GET   /admin/analytics` — Campus-wide issue metrics, category counts, and resolution rates
- `GET   /admin/users` — List registered users and staff
- `POST  /admin/users` — Add a new maintenance technician
- `PATCH /admin/users/:id/status` — Activate/deactivate user

### Notifications (`/notifications`)
- `GET   /notifications` — User's recent notifications
- `PATCH /notifications/:id/read` — Mark a notification as read
- `PATCH /notifications/mark-all-read` — Mark all notifications as read
