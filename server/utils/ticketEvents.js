const Activity = require('../models/Activity'); const Notification = require('../models/Notification');
async function activity(ticketId, userId, action, oldValue = '', newValue = '', note = '') { return Activity.create({ ticketId, performedBy: userId, action, oldValue, newValue, note }); }
async function notify(recipient, ticketId, title, message, type = 'ticket') { if (recipient) return Notification.create({ recipient, ticketId, title, message, type }); }
module.exports = { activity, notify };
