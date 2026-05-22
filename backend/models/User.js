/**
 * Simple User model schema (file-backed storage)
 * This is not a database ORM model, but a small schema helper
 * that centralizes the shape of user objects used by the app.
 */

function createUser({ id, name, email, role = 'user', passwordHash, createdAt }) {
  return {
    id,
    name: name || '',
    email: (email || '').toLowerCase(),
    role: role === 'admin' ? 'admin' : 'user',
    passwordHash,
    createdAt: createdAt || new Date().toISOString(),
  };
}

function sanitize(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

module.exports = { createUser, sanitize };
