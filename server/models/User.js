const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'faculty', 'admin', 'staff'], default: 'student' },
  department: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.methods.verifyPassword = function (password) { return bcrypt.compare(password, this.passwordHash); };
userSchema.methods.toSafeObject = function () { return { id: this._id, name: this.name, email: this.email, role: this.role, department: this.department, isActive: this.isActive }; };
module.exports = mongoose.model('User', userSchema);
