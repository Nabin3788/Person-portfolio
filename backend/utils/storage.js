const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) || [];
  } catch (e) {
    return [];
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function dataPaths(rootDir) {
  const dataDir = path.join(rootDir, 'data');
  ensureDir(dataDir);
  return {
    usersFile: path.join(dataDir, 'users.json'),
    contactsFile: path.join(dataDir, 'contacts.json'),
  };
}

module.exports = { readJson, writeJson, ensureDir, dataPaths };
