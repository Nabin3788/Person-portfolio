const { readJson, writeJson, dataPaths } = require('../utils/storage');
const { createContact } = require('../models/Contact');
const path = require('path');

function getFiles() {
  const root = path.join(__dirname, '..');
  return dataPaths(root);
}

function normalizeContact(contact) {
  if (!contact) return contact;
  const legacyMessages = [];

  if (contact.message) {
    legacyMessages.push({
      id: `${contact.id}-user`,
      sender: 'user',
      text: contact.message,
      createdAt: contact.createdAt || new Date().toISOString(),
    });
  }

  if (Array.isArray(contact.replies)) {
    legacyMessages.push(
      ...contact.replies.map((reply) => ({
        id: reply.id || `${contact.id}-reply-${Date.now()}`,
        sender: 'admin',
        text: reply.text,
        createdAt: reply.createdAt || reply.repliedAt || new Date().toISOString(),
      }))
    );
  }

  const messages = Array.isArray(contact.messages) && contact.messages.length > 0
    ? contact.messages
    : legacyMessages;

  return {
    ...contact,
    messages,
  };
}

function createMessage(req, res) {
  const { name, email, message, conversationId } = req.body;
  if (!message || !email) return res.status(400).json({ error: 'Email and message required' });
  const files = getFiles();
  const contacts = readJson(files.contactsFile);
  const submittedBy = req.user ? req.user.id : null;

  if (conversationId) {
    const idx = contacts.findIndex((c) => c.id === conversationId);
    if (idx === -1) return res.status(404).json({ error: 'Conversation not found' });
    const contact = contacts[idx];
    if (contact.submittedBy && contact.submittedBy !== submittedBy) {
      return res.status(403).json({ error: 'Not allowed to update this conversation' });
    }
    if (!contact.messages) contact.messages = [];
    contact.messages.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
      sender: 'user',
      text: message,
      createdAt: new Date().toISOString(),
    });
    contact.status = 'pending';
    contact.updatedAt = new Date().toISOString();
    writeJson(files.contactsFile, contacts);
    return res.json({ ok: true, conversation: normalizeContact(contact) });
  }

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  const contact = createContact({ id, name, email, message, submittedBy });
  contacts.push(contact);
  writeJson(files.contactsFile, contacts);
  res.json(normalizeContact(contact));
}

function listMessages(req, res) {
  const files = getFiles();
  const contacts = readJson(files.contactsFile);
  res.json(contacts.map(normalizeContact));
}

function listOwnMessages(req, res) {
  const files = getFiles();
  const contacts = readJson(files.contactsFile);
  const userEmail = (req.user?.email || '').toLowerCase();
  const myMessages = contacts.filter((contact) => {
    if (!contact) return false;
    if (contact.submittedBy && contact.submittedBy === req.user.id) return true;
    return (contact.email || '').toLowerCase() === userEmail;
  });
  res.json(myMessages.map(normalizeContact));
}

function addUserMessage(req, res) {
  const { message } = req.body;
  const { id } = req.params;
  if (!id || !message) return res.status(400).json({ error: 'id and message required' });
  const files = getFiles();
  const contacts = readJson(files.contactsFile);
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Conversation not found' });
  const contact = contacts[idx];
  const userEmail = (req.user?.email || '').toLowerCase();
  if (contact.submittedBy && contact.submittedBy !== req.user.id && (contact.email || '').toLowerCase() !== userEmail) {
    return res.status(403).json({ error: 'Not allowed to update this conversation' });
  }

  if (!contact.messages) contact.messages = [];
  contact.messages.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    sender: 'user',
    text: message,
    createdAt: new Date().toISOString(),
  });
  contact.status = 'pending';
  contact.updatedAt = new Date().toISOString();
  writeJson(files.contactsFile, contacts);
  res.json({ ok: true, conversation: normalizeContact(contact) });
}

function replyToMessage(req, res) {
  const { id, reply } = req.body;
  if (!id || !reply) return res.status(400).json({ error: 'id and reply required' });
  const files = getFiles();
  const contacts = readJson(files.contactsFile);
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Message not found' });
  const contact = contacts[idx];
  const r = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    text: reply,
    createdAt: new Date().toISOString(),
  };
  contact.replies = contact.replies || [];
  contact.replies.push(r);
  if (!contact.messages) contact.messages = [];
  contact.messages.push({
    id: r.id,
    sender: 'admin',
    text: reply,
    createdAt: r.createdAt,
  });
  contact.status = 'replied';
  contact.notificationRead = false;
  contact.updatedAt = new Date().toISOString();
  writeJson(files.contactsFile, contacts);
  res.json({ ok: true, conversation: normalizeContact(contact) });
}

module.exports = { createMessage, listMessages, listOwnMessages, addUserMessage, replyToMessage };
