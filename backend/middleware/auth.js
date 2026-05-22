const jwt = require('jsonwebtoken');
const { readJson } = require('../utils/storage');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const COOKIE_NAME = 'portfolio_token';

// attempt to use Mongoose User model if available
let UserModel;
try {
  UserModel = require('../models/userModel');
} catch (e) {
  UserModel = null;
}

function loadUsers() {
  const usersFile = path.join(__dirname, '..', 'data', 'users.json');
  return readJson(usersFile);
}

async function authenticate(req, res, next) {
  const token = (req.cookies && req.cookies[COOKIE_NAME]) || (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (UserModel && UserModel.findById) {
      const userDoc = await UserModel.findById(payload.id).lean();
      if (userDoc) {
        const { passwordHash, __v, ...rest } = userDoc;
        req.user = rest;
        return next();
      }
    }
    // fallback to file-based users
    const users = loadUsers();
    const user = users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ error: 'Invalid token user' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin required' });
  next();
}

module.exports = { authenticate, requireAdmin, COOKIE_NAME };
