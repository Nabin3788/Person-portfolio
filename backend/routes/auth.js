const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', authenticate, auth.me);
router.get('/admin-available', auth.adminAvailable);
router.post('/logout', auth.logout);

module.exports = router;
