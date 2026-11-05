require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const bcrypt = require('bcryptjs');
const connectDatabase = require('./config/db');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Activity = require('./models/Activity');
const Notification = require('./models/Notification');
const Feedback = require('./models/Feedback');

const accounts = [
  { name: 'Riya Sharma', email: 'riya@campusfix.edu', role: 'admin', department: 'Facilities Administration' },
  { name: 'Aasish Student', email: 'aasish@campusfix.edu', role: 'student', department: 'Computer Science & Engineering' },
  { name: 'Arjun Kumar', email: 'arjun@campusfix.edu', role: 'staff', department: 'Electrical & Equipment' },
  { name: 'Nikhil Rao', email: 'nikhil@campusfix.edu', role: 'staff', department: 'Plumbing & Water Systems' },
  { name: 'Priya Sharma', email: 'priya@campusfix.edu', role: 'staff', department: 'Network & IT Infrastructure' },
  { name: 'Anita Devi', email: 'anita@campusfix.edu', role: 'staff', department: 'Sanitation & Housekeeping' },
  { name: 'Dr. Ramesh V', email: 'ramesh@campusfix.edu', role: 'faculty', department: 'Electronics & Communication' }
];

// Helper to create clean inline SVG image data URLs for real visual evidence
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

async function seed() {
  await connectDatabase();
  console.log('Seeding CampusFix database with true authentic data...');

  const passwordHash = await bcrypt.hash('CampusFix@123', 12);
  const userMap = {};

  for (const acc of accounts) {
    const user = await User.findOneAndUpdate(
      { email: acc.email },
      { ...acc, passwordHash, isActive: true },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    userMap[acc.email] = user;
    console.log(`User: ${acc.name} (${acc.role}) -> ${acc.email}`);
  }

  // Clear previous demo records
  await Ticket.deleteMany({});
  await Activity.deleteMany({});
  await Notification.deleteMany({});
  await Feedback.deleteMany({});

  const now = new Date('2026-11-05T10:00:00.000Z');

  // Month offset helper
  const dateInMonth = (monthOffset, day = 10, hour = 11) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - monthOffset);
    d.setDate(day);
    d.setHours(hour, 30, 0, 0);
    return d;
  };

  // Past Historical Tickets (June - October 2026) for genuine analytics & monthly graph
  const pastMonthsTickets = [
    // Month -5 (June 2026)
    { code: 'CF-2026-1011', title: 'Lab 1 network switch restart', cat: 'Internet / Network', bld: 'B Block', loc: 'B Block • Lab 1', p: 'Medium', st: 'Resolved', mOff: 5, day: 4, staff: 'priya@campusfix.edu' },
    { code: 'CF-2026-1012', title: 'Main library water cooler filter replace', cat: 'Plumbing', bld: 'Central Library', loc: 'Central Library • 1st Floor', p: 'Low', st: 'Resolved', mOff: 5, day: 7, staff: 'nikhil@campusfix.edu' },
    { code: 'CF-2026-1013', title: 'Seminar hall tube light flickering', cat: 'Electrical', bld: 'A Block', loc: 'A Block • Seminar 2', p: 'Low', st: 'Resolved', mOff: 5, day: 11, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1014', title: 'Restroom exhaust fan noisy', cat: 'Electrical', bld: 'C Block', loc: 'C Block • 2nd floor', p: 'Medium', st: 'Resolved', mOff: 5, day: 15, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1015', title: 'Hostel Block A hot water geyser trip', cat: 'Electrical', bld: 'Hostel Block', loc: 'Hostel Block • Wing 1', p: 'High', st: 'Resolved', mOff: 5, day: 18, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1016', title: 'Broken bench near basketball court', cat: 'Furniture', bld: 'A Block', loc: 'A Block • Court Side', p: 'Low', st: 'Closed', mOff: 5, day: 20, staff: 'anita@campusfix.edu' },
    { code: 'CF-2026-1017', title: 'Corridor window latch broken', cat: 'Furniture', bld: 'B Block', loc: 'B Block • 3rd floor', p: 'Medium', st: 'Resolved', mOff: 5, day: 22, staff: 'anita@campusfix.edu' },
    { code: 'CF-2026-1018', title: 'Library e-zone workstation 12 offline', cat: 'Internet / Network', bld: 'Central Library', loc: 'Central Library • Digital Section', p: 'High', st: 'Resolved', mOff: 5, day: 25, staff: 'priya@campusfix.edu' },

    // Month -4 (July 2026)
    { code: 'CF-2026-1120', title: 'A Block audio amplifier humming', cat: 'Classroom Equipment', bld: 'A Block', loc: 'A Block • Room 102', p: 'Medium', st: 'Resolved', mOff: 4, day: 2, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1121', title: 'Central lawn sprinkler pipe burst', cat: 'Plumbing', bld: 'Central Library', loc: 'Central Library • North Garden', p: 'High', st: 'Resolved', mOff: 4, day: 6, staff: 'nikhil@campusfix.edu' },
    { code: 'CF-2026-1122', title: 'Hostel Block mess water tap loose', cat: 'Plumbing', bld: 'Hostel Block', loc: 'Hostel Block • Dining Hall', p: 'Medium', st: 'Resolved', mOff: 4, day: 9, staff: 'nikhil@campusfix.edu' },
    { code: 'CF-2026-1123', title: 'C Block 301 HDMI cable replacement', cat: 'Classroom Equipment', bld: 'C Block', loc: 'C Block • Room 301', p: 'Medium', st: 'Resolved', mOff: 4, day: 14, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1124', title: 'Sanitizer dispenser refilling in B Block', cat: 'Sanitation', bld: 'B Block', loc: 'B Block • Lobby', p: 'Low', st: 'Closed', mOff: 4, day: 18, staff: 'anita@campusfix.edu' },
    { code: 'CF-2026-1125', title: 'Hostel Wi-Fi AP-02 reset', cat: 'Internet / Network', bld: 'Hostel Block', loc: 'Hostel Block • Ground Floor', p: 'High', st: 'Resolved', mOff: 4, day: 21, staff: 'priya@campusfix.edu' },
    { code: 'CF-2026-1126', title: 'Classroom 204 chair wheel stuck', cat: 'Furniture', bld: 'C Block', loc: 'C Block • Room 204', p: 'Low', st: 'Resolved', mOff: 4, day: 26, staff: 'anita@campusfix.edu' },

    // Month -3 (August 2026)
    { code: 'CF-2026-1230', title: 'Chemistry lab eye wash station check', cat: 'Plumbing', bld: 'B Block', loc: 'B Block • Lab 4', p: 'Critical', st: 'Resolved', mOff: 3, day: 3, staff: 'nikhil@campusfix.edu' },
    { code: 'CF-2026-1231', title: 'Library ground floor AC thermostat', cat: 'Electrical', bld: 'Central Library', loc: 'Central Library • Reading Hall', p: 'High', st: 'Resolved', mOff: 3, day: 8, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1232', title: 'Smartboard touch calibration needed', cat: 'Classroom Equipment', bld: 'A Block', loc: 'A Block • Room 205', p: 'Medium', st: 'Resolved', mOff: 3, day: 12, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1233', title: 'Hostel Block C 1st floor dustbin repair', cat: 'Sanitation', bld: 'Hostel Block', loc: 'Hostel Block • 1st Floor', p: 'Low', st: 'Closed', mOff: 3, day: 16, staff: 'anita@campusfix.edu' },
    { code: 'CF-2026-1234', title: 'C Block staircase emergency light', cat: 'Electrical', bld: 'C Block', loc: 'C Block • East Stairs', p: 'High', st: 'Resolved', mOff: 3, day: 20, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1235', title: 'Faculty room printer network config', cat: 'Internet / Network', bld: 'A Block', loc: 'A Block • Staff Room 3', p: 'Medium', st: 'Resolved', mOff: 3, day: 24, staff: 'priya@campusfix.edu' },
    { code: 'CF-2026-1236', title: 'Lecture hall 1 acoustic door seal', cat: 'Furniture', bld: 'A Block', loc: 'A Block • LH-1', p: 'Medium', st: 'Resolved', mOff: 3, day: 28, staff: 'anita@campusfix.edu' },

    // Month -2 (September 2026)
    { code: 'CF-2026-1340', title: 'Main server room UPS battery check', cat: 'Electrical', bld: 'B Block', loc: 'B Block • Server Hub', p: 'Critical', st: 'Resolved', mOff: 2, day: 2, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1341', title: 'Auditorium stage lighting panel dimmer', cat: 'Electrical', bld: 'A Block', loc: 'A Block • Auditorium', p: 'High', st: 'Resolved', mOff: 2, day: 7, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1342', title: 'Hostel Block B roof drainage clear', cat: 'Plumbing', bld: 'Hostel Block', loc: 'Hostel Block • Terrace', p: 'High', st: 'Resolved', mOff: 2, day: 11, staff: 'nikhil@campusfix.edu' },
    { code: 'CF-2026-1343', title: 'Computer center fiber uplink latency', cat: 'Internet / Network', bld: 'C Block', loc: 'C Block • Computer Center', p: 'Critical', st: 'Resolved', mOff: 2, day: 15, staff: 'priya@campusfix.edu' },
    { code: 'CF-2026-1344', title: 'C-102 whiteboard hinge replacement', cat: 'Furniture', bld: 'C Block', loc: 'C Block • Room 102', p: 'Low', st: 'Closed', mOff: 2, day: 19, staff: 'anita@campusfix.edu' },
    { code: 'CF-2026-1345', title: 'Library 3rd floor washroom flush valve', cat: 'Plumbing', bld: 'Central Library', loc: 'Central Library • 3rd floor', p: 'Medium', st: 'Resolved', mOff: 2, day: 23, staff: 'nikhil@campusfix.edu' },
    { code: 'CF-2026-1346', title: 'Conference hall mic battery charging dock', cat: 'Classroom Equipment', bld: 'A Block', loc: 'A Block • Conference Hall', p: 'Medium', st: 'Resolved', mOff: 2, day: 27, staff: 'arjun@campusfix.edu' },

    // Month -1 (October 2026)
    { code: 'CF-2026-1501', title: 'Physics lab galvanometer bench wiring', cat: 'Electrical', bld: 'B Block', loc: 'B Block • Lab 2', p: 'High', st: 'Resolved', mOff: 1, day: 3, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1502', title: 'Hostel Block water tank level sensor', cat: 'Plumbing', bld: 'Hostel Block', loc: 'Hostel Block • Overhead Tank', p: 'High', st: 'Resolved', mOff: 1, day: 6, staff: 'nikhil@campusfix.edu' },
    { code: 'CF-2026-1503', title: 'Digital library kiosk touchscreen lag', cat: 'Classroom Equipment', bld: 'Central Library', loc: 'Central Library • Ground Lobby', p: 'Medium', st: 'Resolved', mOff: 1, day: 10, staff: 'priya@campusfix.edu' },
    { code: 'CF-2026-1504', title: 'C Block water cooler drainage tray cleaning', cat: 'Sanitation', bld: 'C Block', loc: 'C Block • 1st floor', p: 'Low', st: 'Closed', mOff: 1, day: 14, staff: 'anita@campusfix.edu' },
    { code: 'CF-2026-1505', title: 'Classroom C-304 speaker output crackling', cat: 'Classroom Equipment', bld: 'C Block', loc: 'C Block • Room 304', p: 'Medium', st: 'Resolved', mOff: 1, day: 18, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1506', title: 'Seminar Hall 1 projector remote battery', cat: 'Classroom Equipment', bld: 'A Block', loc: 'A Block • Seminar 1', p: 'Low', st: 'Resolved', mOff: 1, day: 22, staff: 'arjun@campusfix.edu' },
    { code: 'CF-2026-1507', title: 'Campus outdoor Wi-Fi mesh node reboot', cat: 'Internet / Network', bld: 'Central Library', loc: 'Central Library • Plaza', p: 'Medium', st: 'Resolved', mOff: 1, day: 26, staff: 'priya@campusfix.edu' }
  ];

  for (const item of pastMonthsTickets) {
    const createdAt = dateInMonth(item.mOff, item.day, 10);
    const resolvedAt = new Date(createdAt.getTime() + 14 * 3600 * 1000);

    const ticket = await Ticket.create({
      ticketCode: item.code,
      title: item.title,
      category: item.cat,
      building: item.bld,
      location: item.loc,
      priority: item.p,
      status: item.st,
      description: `Reported issue: ${item.title}. Required on-site technician inspection and service.`,
      resolutionNote: `Maintenance inspected, resolved, and verified operational state with staff on duty.`,
      createdBy: userMap['ramesh@campusfix.edu']._id,
      assignedTo: userMap[item.staff]._id,
      images: [photoProjector],
      createdAt,
      updatedAt: resolvedAt
    });

    await Activity.create({
      ticketId: ticket._id,
      performedBy: ticket.createdBy,
      action: 'Issue submitted',
      newValue: 'Submitted',
      note: item.title,
      createdAt
    });

    await Activity.create({
      ticketId: ticket._id,
      performedBy: ticket.assignedTo,
      action: 'Status updated',
      oldValue: 'In progress',
      newValue: item.st,
      note: 'Task completed and verified',
      createdAt: resolvedAt
    });

    // Add verified student review for selected past resolved tickets
    if (['CF-2026-1011', 'CF-2026-1121', 'CF-2026-1231', 'CF-2026-1340', 'CF-2026-1501'].includes(item.code)) {
      await Feedback.create({
        ticketId: ticket._id,
        userId: userMap['aasish@campusfix.edu']._id,
        rating: item.code === 'CF-2026-1501' ? 4 : 5,
        comment: item.code === 'CF-2026-1501'
          ? 'Wiring was fixed safely. Good job by the electrical team.'
          : 'Resolved very quickly within the SLA timeframe. Clean work!',
        createdAt: new Date(resolvedAt.getTime() + 30 * 60 * 1000)
      });
    }
  }

  // Current Month (November 2026) Tickets - Active & Student Dashboard Reference Records
  const currentMonthTickets = [
    {
      ticketCode: 'CF-2026-1842',
      title: 'Projector flickering in C-204',
      category: 'Classroom Equipment',
      building: 'C Block',
      location: 'C Block • Room 204',
      priority: 'High',
      status: 'In progress',
      description: 'The ceiling projector turns off intermittently during morning lectures. The HDMI socket also feels loose.',
      createdBy: userMap['aasish@campusfix.edu']._id,
      assignedTo: userMap['arjun@campusfix.edu']._id,
      images: [photoProjector],
      createdAt: new Date('2026-11-05T07:15:00.000Z'),
      updatedAt: new Date('2026-11-05T07:45:00.000Z')
    },
    {
      ticketCode: 'CF-2026-1837',
      title: 'Water leakage near library entrance',
      category: 'Plumbing',
      building: 'Central Library',
      location: 'Central Library • Ground floor lobby',
      priority: 'Medium',
      status: 'Assigned',
      description: 'Water is pooling near the turnstiles from an overhead valve whenever the reservoir is filled.',
      createdBy: userMap['aasish@campusfix.edu']._id,
      assignedTo: userMap['nikhil@campusfix.edu']._id,
      images: [photoWaterLeak],
      createdAt: new Date('2026-11-05T06:30:00.000Z'),
      updatedAt: new Date('2026-11-05T06:50:00.000Z')
    },
    {
      ticketCode: 'CF-2026-1829',
      title: 'Wi-Fi unavailable in hostel block B',
      category: 'Internet / Network',
      building: 'Hostel Block',
      location: 'Hostel Block • 2nd floor corridors',
      priority: 'High',
      status: 'Resolved',
      description: 'CampusNet signal keeps dropping on the eastern wing. No internet connectivity since yesterday night.',
      resolutionNote: 'Access point AP-HB-04 had a damaged PoE injector. Replaced unit and verified 120Mbps connectivity.',
      createdBy: userMap['aasish@campusfix.edu']._id,
      assignedTo: userMap['priya@campusfix.edu']._id,
      images: [photoWifi],
      createdAt: new Date('2026-11-04T18:00:00.000Z'),
      updatedAt: new Date('2026-11-05T03:30:00.000Z'),
      feedback: {
        rating: 5,
        comment: 'Wi-Fi was restored very quickly before evening study hours. Blazing fast speeds now, great work Priya!'
      }
    },
    {
      ticketCode: 'CF-2026-1847',
      title: 'HDMI cable damaged in C-204',
      category: 'Classroom Equipment',
      building: 'C Block',
      location: 'C Block • Room 204 podium',
      priority: 'High',
      status: 'Resolved',
      description: 'The podium laptop cable pin was bent and caused display discoloration on the main projector screen.',
      resolutionNote: 'Brand new 4K high-speed braided HDMI cable installed and tested with laptop display.',
      createdBy: userMap['aasish@campusfix.edu']._id,
      assignedTo: userMap['arjun@campusfix.edu']._id,
      images: [photoProjector],
      createdAt: new Date('2026-11-05T07:19:00.000Z'),
      updatedAt: new Date('2026-11-05T08:10:00.000Z'),
      feedback: {
        rating: 5,
        comment: 'Super fast response! Arjun replaced the damaged cable within 40 minutes of reporting.'
      }
    },
    {
      ticketCode: 'CF-2026-1798',
      title: 'Auditorium microphone failure',
      category: 'Classroom Equipment',
      building: 'A Block',
      location: 'A Block • Main Auditorium',
      priority: 'High',
      status: 'Resolved',
      description: 'Podium wireless collar microphone loses audio every 2 minutes.',
      resolutionNote: 'Transmitter battery replaced and UHF frequency retuned to avoid cross-talk.',
      createdBy: userMap['aasish@campusfix.edu']._id,
      assignedTo: userMap['arjun@campusfix.edu']._id,
      images: [photoMic],
      createdAt: new Date('2026-11-03T11:00:00.000Z'),
      updatedAt: new Date('2026-11-03T14:20:00.000Z'),
      feedback: {
        rating: 5,
        comment: 'Audio worked without any dropouts during the symposium. Thank you team!'
      }
    },
    {
      ticketCode: 'CF-2026-1812',
      title: 'Washroom cleaning required',
      category: 'Sanitation',
      building: 'A Block',
      location: 'A Block • 3rd floor west wing',
      priority: 'Medium',
      status: 'Closed',
      description: 'Soap dispenser is empty and floor drain is slightly clogged.',
      resolutionNote: 'Deep cleaned, sanitised, and soap refilled.',
      createdBy: userMap['aasish@campusfix.edu']._id,
      assignedTo: userMap['anita@campusfix.edu']._id,
      images: [photoSanitation],
      createdAt: new Date('2026-11-02T09:00:00.000Z'),
      updatedAt: new Date('2026-11-02T12:00:00.000Z'),
      feedback: {
        rating: 4,
        comment: 'Cleaned thoroughly and refilled soap promptly.'
      }
    },
    {
      ticketCode: 'CF-2026-1818',
      title: 'Broken desk in seminar hall',
      category: 'Furniture',
      building: 'A Block',
      location: 'A Block • Seminar Hall 1',
      priority: 'Low',
      status: 'Submitted',
      description: 'Row 4 right seat has a detached wooden armrest and exposed screw points.',
      createdBy: userMap['ramesh@campusfix.edu']._id,
      assignedTo: null,
      images: [],
      createdAt: new Date('2026-11-05T08:00:00.000Z'),
      updatedAt: new Date('2026-11-05T08:00:00.000Z')
    },
    {
      ticketCode: 'CF-2026-1805',
      title: 'Lab 3 AC unit not cooling',
      category: 'Electrical',
      building: 'B Block',
      location: 'B Block • Lab 3',
      priority: 'Critical',
      status: 'In progress',
      description: 'Main AC unit is making a grinding noise and blowing hot air. Server rack inside the lab is getting warm.',
      createdBy: userMap['ramesh@campusfix.edu']._id,
      assignedTo: userMap['arjun@campusfix.edu']._id,
      images: [photoProjector],
      createdAt: new Date('2026-11-04T10:00:00.000Z'),
      updatedAt: new Date('2026-11-04T11:30:00.000Z')
    }
  ];

  for (const item of currentMonthTickets) {
    const { feedback: fbData, ...ticketFields } = item;
    const t = await Ticket.create(ticketFields);

    // Initial creation activity
    await Activity.create({
      ticketId: t._id,
      performedBy: t.createdBy,
      action: 'Issue submitted',
      newValue: 'Submitted',
      note: t.description.slice(0, 100),
      createdAt: t.createdAt
    });

    if (t.assignedTo) {
      await Activity.create({
        ticketId: t._id,
        performedBy: userMap['riya@campusfix.edu']._id,
        action: 'Assignment updated',
        oldValue: 'Unassigned',
        newValue: accounts.find(a => userMap[a.email]._id.equals(t.assignedTo))?.name || 'Staff',
        note: 'Assigned based on category specialization',
        createdAt: new Date(t.createdAt.getTime() + 15 * 60 * 1000)
      });
    }

    if (t.status === 'In progress') {
      await Activity.create({
        ticketId: t._id,
        performedBy: t.assignedTo,
        action: 'Status updated',
        oldValue: 'Assigned',
        newValue: 'In progress',
        note: 'Technician on-site inspecting the issue',
        createdAt: new Date(t.createdAt.getTime() + 45 * 60 * 1000)
      });
    } else if (t.status === 'Resolved' || t.status === 'Closed') {
      await Activity.create({
        ticketId: t._id,
        performedBy: t.assignedTo,
        action: 'Status updated',
        oldValue: 'In progress',
        newValue: t.status,
        note: t.resolutionNote || 'Work completed successfully',
        createdAt: t.updatedAt
      });
    }

    if (fbData) {
      await Feedback.create({
        ticketId: t._id,
        userId: t.createdBy,
        rating: fbData.rating,
        comment: fbData.comment,
        createdAt: new Date(t.updatedAt.getTime() + 10 * 60 * 1000)
      });
    }
  }

  // Create notifications for Aasish and staff
  const tWifi = await Ticket.findOne({ ticketCode: 'CF-2026-1829' });
  const tProj = await Ticket.findOne({ ticketCode: 'CF-2026-1842' });
  const tHdmi = await Ticket.findOne({ ticketCode: 'CF-2026-1847' });

  await Notification.create([
    {
      recipient: userMap['aasish@campusfix.edu']._id,
      ticketId: tHdmi._id,
      title: 'Issue Resolved',
      message: 'CF-2026-1847 (HDMI cable replaced in C-204) has been marked Resolved. Tap to share feedback.',
      type: 'update',
      isRead: false
    },
    {
      recipient: userMap['aasish@campusfix.edu']._id,
      ticketId: tWifi._id,
      title: 'Feedback Verified',
      message: 'Your 5-star review for CF-2026-1829 (Hostel Wi-Fi) was recorded.',
      type: 'feedback',
      isRead: false
    },
    {
      recipient: userMap['aasish@campusfix.edu']._id,
      ticketId: tProj._id,
      title: 'Work In Progress',
      message: 'CF-2026-1842 (Projector flickering) is now in progress with Arjun Kumar.',
      type: 'update',
      isRead: false
    },
    {
      recipient: userMap['arjun@campusfix.edu']._id,
      ticketId: tProj._id,
      title: 'New Assignment',
      message: 'CF-2026-1842 was assigned to you by Facilities Administration.',
      type: 'assignment',
      isRead: false
    }
  ]);

  const totalTickets = await Ticket.countDocuments();
  const totalFeedbacks = await Feedback.countDocuments();
  console.log(`Database seeded successfully! Total tickets: ${totalTickets}, Total reviews: ${totalFeedbacks}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
