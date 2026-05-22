/**
 * Contact model helper (file-backed).
 */

function createContact({ id, name, email, message, submittedBy, status = 'pending', createdAt, replies = [], messages = [] }) {
  const initialMessages = messages.length
    ? messages
    : message
    ? [{ id: `${id}-msg`, sender: 'user', text: message, createdAt: createdAt || new Date().toISOString() }]
    : [];

  return {
    id,
    name: name || '',
    email: email || '',
    submittedBy: submittedBy || '',
    status,
    createdAt: createdAt || new Date().toISOString(),
    replies: replies || [],
    messages: initialMessages,
    notificationRead: false,
  };
}

module.exports = { createContact };
