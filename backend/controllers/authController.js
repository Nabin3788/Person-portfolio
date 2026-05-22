const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readJson, writeJson, dataPaths } = require('../utils/storage');
const { createUser, sanitize } = require('../models/User');
const path = require('path');

let UserModel;
try { UserModel = require('../models/userModel'); } catch (e) { UserModel = null; }

let _migrated = false;

async function ensureMigration(files) {
  if (!UserModel || _migrated) return;
  const count = await UserModel.countDocuments().catch(() => 0);
  if (count > 0) { _migrated = true; return; }
  const fileUsers = readJson(files.usersFile) || [];
  if (!fileUsers.length) { _migrated = true; return; }
  const toInsert = fileUsers.map(u => ({
    _id: u.id,
    name: u.name || '',
    email: (u.email||'').toLowerCase(),
    role: u.role || 'user',
    passwordHash: u.passwordHash || '',
    createdAt: u.createdAt || new Date().toISOString(),
  }));
  try {
    await UserModel.insertMany(toInsert, { ordered: false });
  } catch (e) {
    // ignore duplicates or errors
  }
  _migrated = true;
}

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const COOKIE_NAME = 'portfolio_token';
const COOKIE_OPTS = { httpOnly: true, sameSite: 'lax' };

function getFiles() {
  const root = path.join(__dirname, '..');
  return dataPaths(root);
}

async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const files = getFiles();
  // if DB present, migrate file users and use DB
  if (UserModel) {
    await ensureMigration(files);
    const anyAdmin = await UserModel.findOne({ role: 'admin' }).lean();
    if (role === 'admin' && anyAdmin) return res.status(400).json({ error: 'Admin already exists' });
    const exists = await UserModel.findOne({ email: email.toLowerCase() }).lean();
    if (exists) return res.status(400).json({ error: 'Email already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name: name||'', email: email.toLowerCase(), role: role||'user', passwordHash });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    const { passwordHash: ph, __v, ...rest } = newUser.toObject();
    return res.json({ user: rest });
  }
  // fallback file-based
  const users = readJson(files.usersFile);
  // enforce single admin
  if (role === 'admin') {
    const anyAdmin = users.find(u => u.role === 'admin');
    if (anyAdmin) return res.status(400).json({ error: 'Admin already exists' });
  }
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(400).json({ error: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  const user = createUser({ id, name, email, role: role || 'user', passwordHash });
  users.push(user);
  writeJson(files.usersFile, users);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
  res.json({ user: sanitize(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  const files = getFiles();
  if (UserModel) {
    await ensureMigration(files);
    const userDoc = await UserModel.findOne({ email: (email||'').toLowerCase() }).lean();
    if (!userDoc) return res.status(400).json({ error: 'Invalid email or password' });
    const ok = await bcrypt.compare(password, userDoc.passwordHash || '');
    if (!ok) return res.status(400).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: userDoc._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
    const { passwordHash, __v, ...rest } = userDoc;
    return res.json({ user: rest });
  }
  const users = readJson(files.usersFile);
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) return res.status(400).json({ error: 'Invalid email or password' });
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(400).json({ error: 'Invalid email or password' });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
  res.json({ user: sanitize(user) });
}

function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ user: sanitize(req.user) });
}

function adminAvailable(req, res) {
  const files = getFiles();
  if (UserModel) {
    // ensure migration then check DB
    ensureMigration(files).then(async () => {
      const anyAdmin = await UserModel.findOne({ role: 'admin' }).lean();
      res.json({ adminAvailable: !anyAdmin });
    }).catch(() => {
      const users = readJson(files.usersFile);
      const anyAdmin = users.find(u => u.role === 'admin');
      res.json({ adminAvailable: !anyAdmin });
    });
    return;
  }
  const users = readJson(files.usersFile);
  const anyAdmin = users.find(u => u.role === 'admin');
  res.json({ adminAvailable: !anyAdmin });
}

function logout(req, res) {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTS);
  res.json({ ok: true });
}

module.exports = { register, login, me, adminAvailable, logout };
