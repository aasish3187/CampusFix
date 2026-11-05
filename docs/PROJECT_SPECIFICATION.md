CampusFix – Your Final MERN Stack Capstone Project
Project selected Industry-level target

Great choice! Let's finalize CampusFix: Smart Campus Issue Reporting and Resolution Platform as your capstone project.

We're going to build it as a professional, multi-user complaint management platform, not just a basic college complaint registration website.



1. Final project definition
Project title:

CampusFix: A Centralized Smart Campus Issue Reporting and Resolution Platform Using the MERN Stack.

Problem statement

Educational institutions frequently experience infrastructure and maintenance issues, including damaged classroom equipment, malfunctioning projectors, electrical problems, water leakage, internet connectivity failures, and sanitation complaints.

These issues are often reported through informal communication channels, making it difficult to track complaints, assign responsibilities, monitor resolution progress, and maintain accountability.

CampusFix aims to solve this problem by providing a centralized web-based platform where students and faculty can report campus issues, administrators can assign complaints to maintenance personnel, and users can track their complaints throughout the resolution process.

Primary objective: To improve transparency, accountability, and efficiency in campus issue reporting and maintenance management.

2. Application roles
We'll implement four different user roles.

Student / Faculty

Report issues, upload images, track complaints, provide feedback and view updates.

Administrator

Manage users, review complaints, assign staff, set priorities and view analytics.

Maintenance Staff

View assigned complaints, update progress, upload resolution evidence and close tasks.

3. Main application modules
These are the modules I recommend implementing.

Module

Functionalities

Priority

Authentication

Register, login, JWT, password hashing

Essential

User management

Profiles and role permissions

Essential

Complaint reporting

Text, category, location and images

Essential

Complaint tracking

Status and activity timeline

Essential

Staff assignment

Assign tasks to maintenance staff

Essential

Priority management

Low, medium, high, critical

Essential

Search and filtering

Category, status, date, priority

Essential

Notifications

Complaint and assignment updates

Essential

Analytics

Complaint statistics and resolution metrics

Essential

Duplicate detection

Identify potentially similar complaints

Advanced

Feedback

Ratings and comments after resolution

Advanced

My recommendation is to complete all essential modules first. Duplicate detection and feedback can follow once the main workflow is reliable.

4. System architecture
The application will follow a three-layer architecture.

Users: Students / Faculty / Staff/ Admin
React Frontend
Axios API Requests
Express.js Backend
Authentication Middleware
Role-Based Access Control
Application Services
Ticket Management
Assignment Management
Notification Service
Analytics Service
MongoDB Atlas
Cloudinary Image Storage
Socket.IO
How the system works:

A student submits an issue using the React interface.

The frontend sends the complaint to an Express API.

The backend validates the user and complaint information.

MongoDB stores the complaint.

The administrator receives a notification.

The administrator assigns the complaint to maintenance staff.

Staff update the complaint status.

The student receives updates and can follow the complaint timeline.

5. MongoDB database design
I recommend starting with six collections.

Database relationship overview

USERS
TICKETS
ACTIVITIES
NOTIFICATIONS
FEEDBACK
creates
assigned_to
performs
contains
generates
receives
receives
submits
MongoDB uses document references rather than SQL foreign keys. These relationships represent the logical data model.

Collection 1: Users
Stores all registered users.

{
  name: String,
  email: String,
  passwordHash: String,
  role: {
    type: String,
    enum: ["student", "faculty", "admin", "staff"]
  },
  department: String,
  isActive: Boolean,
  createdAt: Date
}

Collection 2: Tickets
Stores submitted campus complaints.

{
  ticketCode: String,
  createdBy: ObjectId,
  title: String,
  description: String,
  category: String,
  building: String,
  location: String,
  images: [String],
  priority: String,
  status: String,
  assignedTo: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}

Allowed ticket categories:

Electrical

Classroom Equipment

Internet / Network

Plumbing

Furniture

Sanitation

Other

Allowed statuses:

[
  "submitted",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
  "reopened"
]

Collection 3: TicketActivities
This is particularly important because it creates a transparent complaint history.

{
  ticketId: ObjectId,
  performedBy: ObjectId,
  action: String,
  oldValue: String,
  newValue: String,
  note: String,
  createdAt: Date
}

Example activity history:

Date

Activity

5 Nov

Complaint submitted

5 Nov

Admin reviewed complaint

6 Nov

Assigned to maintenance staff

6 Nov

Work started

7 Nov

Complaint resolved

Collection 4: Notifications
{
  recipient: ObjectId,
  ticketId: ObjectId,
  title: String,
  message: String,
  type: String,
  isRead: Boolean,
  createdAt: Date
}

Collection 5: Feedback
{
  ticketId: ObjectId,
  userId: ObjectId,
  rating: Number,
  comment: String,
  createdAt: Date
}

Collection 6: Departments
{
  name: String,
  description: String,
  categories: [String],
  isActive: Boolean
}

Important database indexes:

Collection

Index

Purpose

Users

Unique email

Prevent duplicate accounts

Tickets

Unique ticketCode

Unique complaint identifier

Tickets

createdBy + createdAt

User complaint history

Tickets

status + priority

Admin dashboard filtering

Tickets

assignedTo + status

Staff task retrieval

Activities

ticketId + createdAt

Complaint timeline

Notifications

recipient + isRead

Notification retrieval

Store image URLs in MongoDB and the actual images in Cloudinary. Do not store image files directly in MongoDB documents.

6. Complete REST API structure
Use a versioned API structure such as /api/v1.

Authentication APIs
Method

Endpoint

Purpose

POST

/api/v1/auth/register

Register account

POST

/api/v1/auth/login

Login

POST

/api/v1/auth/logout

Logout

GET

/api/v1/auth/me

Current user

PATCH

/api/v1/auth/profile

Update profile

Complaint APIs
Method

Endpoint

Purpose

POST

/api/v1/tickets

Submit complaint

GET

/api/v1/tickets

List complaints

GET

/api/v1/tickets/:id

Complaint details

GET

/api/v1/tickets/my

My complaints

PATCH

/api/v1/tickets/:id

Edit permitted fields

POST

/api/v1/tickets/:id/reopen

Reopen complaint

Admin APIs
Method

Endpoint

Purpose

GET

/api/v1/admin/dashboard

Dashboard statistics

PATCH

/api/v1/admin/tickets/:id/assign

Assign staff

PATCH

/api/v1/admin/tickets/:id/priority

Change priority

GET

/api/v1/admin/users

Manage users

PATCH

/api/v1/admin/users/:id/status

Activate/deactivate user

Maintenance staff APIs
Method

Endpoint

Purpose

GET

/api/v1/staff/assigned

View assigned complaints

PATCH

/api/v1/staff/tickets/:id/status

Update progress

POST

/api/v1/staff/tickets/:id/evidence

Upload resolution evidence

Additional APIs
Method

Endpoint

Purpose

GET

/api/v1/tickets/:id/activities

Complaint timeline

GET

/api/v1/notifications

User notifications

PATCH

/api/v1/notifications/:id/read

Mark notification read

POST

/api/v1/tickets/:id/feedback

Submit rating

GET

/api/v1/analytics

Analytics and reports

Backend rule: The frontend must never decide whether a user is an administrator. The Express middleware must verify the role and permissions on every protected request.

7. Standout features that will differentiate CampusFix
I would prioritize three features to make this project more impressive than a typical complaint management application.



Feature 1: Complaint lifecycle tracking

Every complaint has a complete history of status changes, assignments, responsible users, timestamps and resolution notes.

Essential differentiator


Feature 2: Smart complaint analytics

Display the most frequently reported problems, pending issues, resolution rates, average resolution time and staff workload.

Strong evaluation feature


Feature 3: Duplicate complaint detection

Warn users when a similar unresolved complaint already exists in the same building or location.

Start with category + location + text similarity. You can use MongoDB text search initially and later improve it using semantic similarity.

Advanced feature
For the duplicate detector, show users the existing complaint and let them add their support to it rather than automatically rejecting their report.

8. Four-week implementation plan
Your team has only 3–4 weeks, so I recommend this exact development schedule.

CampusFix development roadmap
Week 1 – Project foundation

Create GitHub repository.

Set up React + Vite and Express.

Connect MongoDB Atlas.

Design database schemas.

Implement registration and login.

Add JWT authentication and role-based authorization.

Create basic dashboards.

Milestone 1: Authentication working
Week 2 – Core complaint management

Create complaint submission forms.

Implement image uploads using Cloudinary.

Implement complaint listing and search.

Implement admin assignment functionality.

Build maintenance staff dashboard.

Implement complaint status updates.

Milestone 2: Complete complaint workflow
Week 3 – Advanced functionality

Add complaint activity timeline.

Implement notifications using Socket.IO.

Create analytics dashboards.

Add priority management.

Implement duplicate complaint suggestions.

Implement user feedback.

Test role permissions and backend validation.

Milestone 3: Advanced features working
Week 4 – Deployment and presentation

Fix bugs and improve user experience.

Test all user roles.

Test API security and edge cases.

Deploy frontend and backend.

Prepare demonstration accounts and data.

Complete documentation and screenshots.

Prepare final presentation.

Milestone 4: Final capstone submission
9. Team task distribution
For three members, I suggest this arrangement.

Member

Role

Responsibilities

1

Frontend developer

React pages, dashboards, forms, routing, responsive UI

2

Backend developer

Express APIs, MongoDB schemas, authentication, business logic

3

Integration developer

Cloudinary, Socket.IO, notifications, analytics, testing and deployment

For a team of two, Member 1 should handle React and API integration, while Member 2 handles backend and database development. Share testing and deployment.

GitHub workflow: Use separate feature branches such as feature/auth, feature/tickets, and feature/admin-dashboard. Merge through pull requests rather than directly modifying the main branch.

10. Suggested frontend pages
Here is the page structure I recommend.

Page

Access

Landing page

Everyone

Registration / Login

Everyone

Student dashboard

Students

Create complaint

Students / Faculty

My complaints

Students / Faculty

Complaint details and timeline

Authorized users

Admin dashboard

Admin

Manage complaints

Admin

Manage users and staff

Admin

Staff dashboard

Maintenance staff

Assigned complaints

Maintenance staff

Notifications

Authenticated users

Profile settings

Authenticated users

For the visual design, use a professional campus management dashboard with a consistent sidebar, top navigation, status badges, search, filters and responsive layouts.

Suggested visual direction:



Admin dashboard

Statistics, assignments and pending issues.


Student dashboard

My complaints, progress and reporting.


Staff dashboard

Assigned jobs and resolution updates.


Complaint submission

Category, description and image uploads.
11. Final project demonstration
This is the demonstration sequence I would use in front of your trainer.

Live demo – One complaint, four stages
Student reports an issue

Log in as a student. Report a broken classroom projector, choose the location, upload a photograph and submit the complaint.

Show the generated complaint ID.

Administrator processes it

Log in as an administrator. Open the complaint, change its priority to high and assign it to a maintenance staff member.

Show the assignment and status history.

Maintenance staff resolves it

Log in as maintenance staff. Open the assigned complaint, update the status to in progress, then resolved, and add a resolution note.

Show the staff workflow.

Student sees the result

Return to the student account. Show the updated complaint status and notification. Submit a rating and feedback.

Show the complete complaint lifecycle.

Administrator views analytics

Show complaint totals, unresolved issues, average resolution time, category distribution and staff workload.

Finish by demonstrating the analytical value of CampusFix.

12. What you should submit
To make this a strong academic and placement project, prepare:

Deliverable

What it should contain

Abstract

Problem, objectives and proposed solution

SRS document

Functional and non-functional requirements

Architecture diagram

Frontend, backend, APIs and database

ER diagram

Collection relationships

API documentation

Endpoint descriptions and sample responses

Source code

Organized GitHub repository

Test cases

Authentication, permissions and workflows

Deployment

Working public application

Project report

Implementation, screenshots and results

Presentation

Approximately 10–12 slides

Suggested GitHub repository structure:

campusfix/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── docs/
│   ├── architecture.png
│   ├── er-diagram.png
│   └── api-documentation.md
│
└── README.md
13. Your first development milestone
Before coding, finalize these three items with your teammates:

Project abstract and objectives.

Functional requirements and use-case diagram.

Database schema and API architecture.

Then begin Week 1.

My recommendation is to avoid adding AI features, payment gateways, or mobile applications during the initial build. A secure, complete complaint-management workflow is much more impressive than several unfinished advanced features.

Let's target this outcome: a deployed CampusFix application where a student submits a complaint, an administrator assigns it, maintenance staff resolves it, and everyone can track the process.