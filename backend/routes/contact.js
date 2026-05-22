const express = require('express');
const router = express.Router();
const contact = require('../controllers/contactController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', authenticate, contact.createMessage);
router.post('/:id/message', authenticate, contact.addUserMessage);
router.get('/mine', authenticate, contact.listOwnMessages);
router.get('/messages', authenticate, requireAdmin, contact.listMessages);
router.post('/reply', authenticate, requireAdmin, contact.replyToMessage);

module.exports = router;
