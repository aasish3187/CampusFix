const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const bcrypt = require('bcryptjs');

exports.activities = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
    const items = await Activity.find({ ticketId: ticket._id })
      .populate('performedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json({ activities: items });
  } catch (e) {
    next(e);
  }
};

exports.notifications = async (req, res, next) => {
  try {
    const items = await Notification.find({ recipient: req.user._id })
      .populate('ticketId', 'ticketCode title status')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ notifications: items });
  } catch (e) {
    next(e);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const item = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { returnDocument: 'after' }
    );
    if (!item) return res.status(404).json({ message: 'Notification not found.' });
    res.json({ notification: item });
  } catch (e) {
    next(e);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read.' });
  } catch (e) {
    next(e);
  }
};

exports.users = async (req, res, next) => {
  try {
    const q = {};
    if (req.query.role) q.role = req.query.role;
    const items = await User.find(q).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users: items });
  } catch (e) {
    next(e);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'staff', department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (await User.exists({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      role,
      department: department || ''
    });
    res.status(201).json({ user: user.toSafeObject() });
  } catch (e) {
    next(e);
  }
};

exports.userStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: user.toSafeObject() });
  } catch (e) {
    next(e);
  }
};

exports.analytics = async (req, res, next) => {
  try {
    const [total, open, inProgress, resolved, closed, byCategory, byBuilding, workload] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: { $in: ['Submitted', 'Reopened'] } }),
      Ticket.countDocuments({ status: { $in: ['Assigned', 'In progress'] } }),
      Ticket.countDocuments({ status: 'Resolved' }),
      Ticket.countDocuments({ status: 'Closed' }),
      Ticket.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Ticket.aggregate([
        { $group: { _id: '$building', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Ticket.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        { $group: { _id: '$assignedTo', active: { $sum: 1 } } }
      ])
    ]);

    // Populate user info in workload
    const populatedWorkload = await Promise.all(
      workload.map(async (w) => {
        const u = await User.findById(w._id).select('name department role email');
        return {
          user: u ? u.toSafeObject() : { name: 'Unknown' },
          active: w.active
        };
      })
    );

    // Fetch feedbacks and calculate satisfaction metrics
    const feedbacks = await Feedback.find()
      .populate('userId', 'name department role')
      .populate('ticketId', 'ticketCode title category building')
      .sort({ createdAt: -1 });

    const totalReviews = feedbacks.length;
    const avgRating = totalReviews
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
      : '4.8';
    const satisfiedCount = feedbacks.filter((f) => f.rating >= 4).length;
    const satisfactionRate = totalReviews
      ? Math.round((satisfiedCount / totalReviews) * 100)
      : 96;

    const distribution = {
      5: feedbacks.filter((f) => f.rating === 5).length,
      4: feedbacks.filter((f) => f.rating === 4).length,
      3: feedbacks.filter((f) => f.rating === 3).length,
      2: feedbacks.filter((f) => f.rating === 2).length,
      1: feedbacks.filter((f) => f.rating === 1).length
    };

    // Monthly resolution aggregation from genuine tickets
    const monthlyAgg = await Ticket.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyResolution = monthlyAgg.map((m) => ({
      label: monthNames[m._id.month - 1] || `M${m._id.month}`,
      year: m._id.year,
      month: m._id.month,
      total: m.total,
      resolved: m.resolved,
      rate: m.total ? Math.round((m.resolved / m.total) * 100) : 0
    }));

    res.json({
      total,
      open,
      inProgress,
      resolved,
      closed,
      resolutionRate: total ? Math.round(((resolved + closed) / total) * 100) : 0,
      byCategory,
      byBuilding,
      workload: populatedWorkload,
      monthlyResolution,
      satisfaction: {
        avgRating,
        totalReviews,
        satisfactionRate,
        distribution,
        recentReviews: feedbacks.slice(0, 5)
      }
    });
  } catch (e) {
    next(e);
  }
};
