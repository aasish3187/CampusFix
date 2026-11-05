const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketCode: { type: String, unique: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Electrical', 'Classroom Equipment', 'Internet / Network', 'Plumbing', 'Furniture', 'Sanitation', 'Other'],
    required: true
  },
  building: { type: String, required: true },
  location: { type: String, required: true },
  images: [String],
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Submitted', 'Assigned', 'In progress', 'Resolved', 'Closed', 'Reopened'],
    default: 'Submitted',
    index: true
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  resolutionNote: { type: String, default: '' },
  resolvedAt: { type: Date }
}, { timestamps: true });

ticketSchema.index({ createdBy: 1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ title: 'text', description: 'text', location: 'text' });

ticketSchema.pre('validate', async function () {
  if (!this.ticketCode) {
    let code;
    let exists = true;
    let attempt = 0;
    while (exists && attempt < 10) {
      const count = await mongoose.model('Ticket').countDocuments();
      code = `CF-${new Date().getFullYear()}-${String(count + 1840 + attempt).padStart(4, '0')}`;
      const found = await mongoose.model('Ticket').findOne({ ticketCode: code });
      if (!found) exists = false;
      attempt++;
    }
    this.ticketCode = code || `CF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
