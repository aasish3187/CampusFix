const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const { activity, notify } = require('../utils/ticketEvents');

const populated = (query) =>
  query
    .populate('createdBy', 'name email department role')
    .populate('assignedTo', 'name email role department');

exports.list = async (req, res, next) => {
  try {
    const { status, priority, category, search, assignedTo, building } = req.query;
    const q = {};

    if (status) q.status = status;
    if (priority) q.priority = priority;
    if (category) q.category = category;
    if (building) q.building = building;

    // Role-based visibility
    if (req.user.role === 'student' || req.user.role === 'faculty') {
      q.createdBy = req.user._id;
    } else if (req.user.role === 'staff') {
      q.assignedTo = req.user._id;
    } else if (assignedTo) {
      q.assignedTo = assignedTo;
    }

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      q.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { ticketCode: regex },
        { category: regex },
        { building: regex }
      ];
    }

    const items = await populated(Ticket.find(q).sort({ updatedAt: -1, createdAt: -1 }));
    const feedbacks = await Feedback.find({ ticketId: { $in: items.map((t) => t._id) } });
    const feedbackMap = {};
    feedbacks.forEach((f) => {
      feedbackMap[f.ticketId.toString()] = f;
    });

    const ticketsWithFeedback = items.map((t) => {
      const obj = t.toObject ? t.toObject() : { ...t };
      obj.feedback = feedbackMap[t._id.toString()] || null;
      return obj;
    });

    res.json({ tickets: ticketsWithFeedback });
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const ticket = await populated(Ticket.findById(req.params.id));
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

    const own = ticket.createdBy._id.equals(req.user._id);
    const assigned = ticket.assignedTo?._id?.equals(req.user._id);

    if (['student', 'faculty'].includes(req.user.role) && !own) {
      return res.status(403).json({ message: 'You can view only your own tickets.' });
    }
    if (req.user.role === 'staff' && !assigned) {
      return res.status(403).json({ message: 'You can view only assigned tickets.' });
    }

    const feedback = await Feedback.findOne({ ticketId: ticket._id });
    res.json({ ticket, feedback });
  } catch (e) {
    next(e);
  }
};

exports.checkDuplicates = async (req, res, next) => {
  try {
    const { building, category, title } = req.query;
    const q = { status: { $nin: ['Resolved', 'Closed'] } };
    if (building) q.building = building;
    if (category) q.category = category;

    if (title && title.trim()) {
      const words = title.trim().split(/\s+/).filter((w) => w.length > 3);
      if (words.length) {
        const regexWords = words.map((w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
        q.$or = regexWords.map((rw) => ({ title: rw }));
      }
    }

    const duplicates = await Ticket.find(q)
      .select('ticketCode title category building location status priority createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ duplicates });
  } catch (e) {
    next(e);
  }
};

exports.staffList = async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff', isActive: true }).select('name email department role');
    res.json({ staff });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, category, building, location, priority = 'Medium', images = [] } = req.body;
    if (!title || !description || !category || !building || !location) {
      return res.status(400).json({ message: 'Complete all required issue details.' });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category,
      building,
      location,
      priority,
      images,
      createdBy: req.user._id
    });

    await activity(ticket._id, req.user._id, 'Issue submitted', '', 'Submitted', description.slice(0, 120));

    const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
    await Promise.all(
      admins.map((a) =>
        notify(a._id, ticket._id, 'New campus issue', `${ticket.ticketCode}: ${ticket.title}`, 'new-ticket')
      )
    );

    res.status(201).json({ ticket: await populated(Ticket.findById(ticket._id)) });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

    const isAdmin = req.user.role === 'admin';
    const isStaff = req.user.role === 'staff' && ticket.assignedTo?.equals(req.user._id);
    const isOwner = ticket.createdBy.equals(req.user._id);

    if (!isAdmin && !isStaff && !(isOwner && ['Submitted', 'Reopened'].includes(ticket.status))) {
      return res.status(403).json({ message: 'You cannot update this ticket.' });
    }

    let newlyAssignedStaff = null;

    // Admin staff assignment
    if (isAdmin && req.body.assignee !== undefined) {
      const prevStaff = ticket.assignedTo ? await User.findById(ticket.assignedTo) : null;
      const oldName = prevStaff ? prevStaff.name : 'Unassigned';

      if (!req.body.assignee || req.body.assignee === 'Unassigned') {
        ticket.assignedTo = null;
        if (ticket.status === 'Assigned') {
          ticket.status = 'Submitted';
        }
        await activity(ticket._id, req.user._id, 'Assignment updated', oldName, 'Unassigned', req.body.note || '');
      } else {
        const queryStaff = String(req.body.assignee).trim();
        newlyAssignedStaff = await User.findOne({
          $or: [
            ...(mongoose.isValidObjectId(queryStaff) ? [{ _id: queryStaff }] : []),
            { name: new RegExp(`^${queryStaff.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
            { email: queryStaff.toLowerCase() }
          ],
          role: 'staff'
        });
        if (!newlyAssignedStaff) return res.status(400).json({ message: 'Select an active maintenance staff member.' });

        const newName = newlyAssignedStaff.name;
        ticket.assignedTo = newlyAssignedStaff._id;

        if (ticket.status === 'Submitted' || ticket.status === 'Reopened') {
          ticket.status = 'Assigned';
        }

        await activity(ticket._id, req.user._id, 'Assignment updated', oldName, newName, req.body.note || '');

        await notify(
          newlyAssignedStaff._id,
          ticket._id,
          'New task assigned',
          `${ticket.ticketCode} (${ticket.title}) was assigned to you.`,
          'assignment'
        );
      }
    }

    // Explicit Status update: ensure we don't accidentally revert Assigned back to Submitted
    const requestedStatus = req.body.status;
    const isRevertingAutoAssigned = newlyAssignedStaff && (requestedStatus === 'Submitted' || requestedStatus === 'Reopened');

    if (requestedStatus && requestedStatus !== ticket.status && !isRevertingAutoAssigned) {
      const oldStatus = ticket.status;
      ticket.status = requestedStatus;

      if (ticket.status === 'Resolved') {
        ticket.resolvedAt = new Date();
      }

      await activity(
        ticket._id,
        req.user._id,
        'Status updated',
        oldStatus,
        ticket.status,
        req.body.resolutionNote || req.body.note || ''
      );
    }

    // Priority update
    if (isAdmin && req.body.priority && req.body.priority !== ticket.priority) {
      const oldPriority = ticket.priority;
      ticket.priority = req.body.priority;
      await activity(ticket._id, req.user._id, 'Priority updated', oldPriority, req.body.priority, req.body.note || '');
    }

    // Resolution note
    if (req.body.resolutionNote !== undefined) {
      ticket.resolutionNote = req.body.resolutionNote;
    }

    // Student owner edits before assignment
    if (isOwner && ['Submitted', 'Reopened'].includes(ticket.status)) {
      ['title', 'description', 'category', 'building', 'location'].forEach((field) => {
        if (req.body[field] !== undefined) ticket[field] = req.body[field];
      });
    }

    await ticket.save();

    // Notify ticket owner of progress if changed by admin or staff
    if (!isOwner) {
      await notify(
        ticket.createdBy,
        ticket._id,
        'Issue updated',
        `${ticket.ticketCode} status is now ${ticket.status}.`,
        'update'
      );
    }

    res.json({ ticket: await populated(Ticket.findById(ticket._id)) });
  } catch (e) {
    next(e);
  }
};

exports.reopen = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

    const isOwner = ticket.createdBy.equals(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only the reporter or administrator can reopen this ticket.' });
    }
    if (!['Resolved', 'Closed'].includes(ticket.status)) {
      return res.status(400).json({ message: 'Only resolved or closed tickets can be reopened.' });
    }

    const oldStatus = ticket.status;
    ticket.status = 'Reopened';
    ticket.resolvedAt = null;
    await ticket.save();

    await activity(
      ticket._id,
      req.user._id,
      'Issue reopened',
      oldStatus,
      'Reopened',
      req.body.note || 'Student indicated issue still persists.'
    );

    const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
    const recipients = admins.map((a) => a._id);
    if (ticket.assignedTo) recipients.push(ticket.assignedTo);

    await Promise.all(
      recipients.map((recId) =>
        notify(recId, ticket._id, 'Issue reopened', `${ticket.ticketCode} was reopened.`, 'reopen')
      )
    );

    res.json({ ticket: await populated(Ticket.findById(ticket._id)) });
  } catch (e) {
    next(e);
  }
};

exports.feedback = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });

    const isOwner = ticket.createdBy.equals(req.user._id);
    if (!isOwner) {
      return res.status(403).json({ message: 'Only the reporter can submit feedback for this ticket.' });
    }
    if (!['Resolved', 'Closed'].includes(ticket.status)) {
      return res.status(400).json({ message: 'Feedback is available after resolution.' });
    }

    const { rating, comment } = req.body;
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    const feedback = await Feedback.findOneAndUpdate(
      { ticketId: ticket._id },
      { ticketId: ticket._id, userId: req.user._id, rating: numRating, comment: comment || '' },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    await activity(ticket._id, req.user._id, 'Feedback submitted', '', `${numRating} ★`, comment || '');

    if (ticket.assignedTo) {
      await notify(
        ticket.assignedTo,
        ticket._id,
        'Feedback received',
        `Student rated ${ticket.ticketCode} ${numRating} stars: "${(comment || '').slice(0, 50)}"`,
        'feedback'
      );
    }

    res.status(201).json({ feedback });
  } catch (e) {
    next(e);
  }
};
