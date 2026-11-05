const jwt = require('jsonwebtoken');
const User = require('../models/User');
async function protect(req, res, next) { try { const token = req.headers.authorization?.split(' ')[1]; if (!token) return res.status(401).json({ message: 'Authentication required.' }); const { id } = jwt.verify(token, process.env.JWT_SECRET); const user = await User.findById(id); if (!user || !user.isActive) return res.status(401).json({ message: 'Account is unavailable.' }); req.user = user; next(); } catch { res.status(401).json({ message: 'Invalid or expired session.' }); } }
const allow = (...roles) => (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission for this action.' });
module.exports = { protect, allow };
