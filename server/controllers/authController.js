const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const token = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, department, role = 'student' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (!['student', 'faculty'].includes(role)) {
      return res.status(400).json({ message: 'Public registration is only available for students and faculty.' });
    }
    if (await User.exists({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: await bcrypt.hash(password, 12),
      department: department || '',
      role
    });

    res.status(201).json({ token: token(user), user: user.toSafeObject() });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated.' });
    }

    // Role check if role was specified in the login form
    if (role) {
      const permitted = role === 'student' ? ['student', 'faculty'].includes(user.role) : user.role === role;
      if (!permitted) {
        return res.status(403).json({
          message: `This account is registered as ${user.role}, not ${role}. Please select the ${user.role === 'admin' ? 'Administrator' : user.role === 'staff' ? 'Maintenance Staff' : 'Student'} tab.`
        });
      }
    }

    res.json({ token: token(user), user: user.toSafeObject() });
  } catch (e) {
    next(e);
  }
};

exports.me = (req, res) => res.json({ user: req.user.toSafeObject() });

exports.profile = async (req, res, next) => {
  try {
    const { name, department } = req.body;
    if (name) req.user.name = name;
    if (department !== undefined) req.user.department = department;
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (e) {
    next(e);
  }
};
