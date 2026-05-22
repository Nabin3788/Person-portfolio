require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// connect to MongoDB when available
try { require('./db').connect(); } catch (e) { /* ignore */ }

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// mount routers
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

app.use('/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Notifications endpoint (file-backed for now)
const { readJson, writeJson, dataPaths } = require('./utils/storage');
const { authenticate } = require('./middleware/auth');
const files = dataPaths(path.join(__dirname));

app.get('/api/notifications', authenticate, (req, res) => {
  const contacts = readJson(files.contactsFile);
  const my = contacts.filter(c => c.email.toLowerCase() === (req.user.email || '').toLowerCase());
  const unreadNotifications = my.filter((contact) => {
    const hasReply = Array.isArray(contact.replies) && contact.replies.length > 0;
    const isUnRead = contact.notificationRead !== true;
    return hasReply && isUnRead;
  });
  const notifications = unreadNotifications.map((contact) => ({
    id: contact.id,
    title: (contact.replies?.[contact.replies.length - 1]?.text || contact.message || '').slice(0, 60),
    status: contact.status,
    replies: contact.replies || [],
    lastReplyAt: contact.replies?.[contact.replies.length - 1]?.createdAt || contact.updatedAt || contact.createdAt,
  }));
  res.json({ unreadCount: notifications.length, notifications });
});

app.post('/api/notifications/read/:id', authenticate, (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'Notification id required' });
  const contacts = readJson(files.contactsFile);
  const userEmail = (req.user?.email || '').toLowerCase();
  const idx = contacts.findIndex((contact) => contact.id === id && (contact.email || '').toLowerCase() === userEmail);
  if (idx === -1) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  contacts[idx].notificationRead = true;
  contacts[idx].notificationReadAt = new Date().toISOString();
  writeJson(files.contactsFile, contacts);
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Portfolio backend running on http://localhost:${port}`));
