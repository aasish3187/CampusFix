const mongoose = require('mongoose');
module.exports = mongoose.model('Notification', new mongoose.Schema({ recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }, title: String, message: String, type: String, isRead: { type: Boolean, default: false } }, { timestamps: true }));
