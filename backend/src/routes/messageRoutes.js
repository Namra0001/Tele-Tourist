const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

router.post('/', auth, messageController.sendMessage);
router.get('/unread-count', auth, messageController.getUnreadCount);
router.get('/conversations', auth, messageController.getConversations);
router.get('/thread/:contactId', auth, messageController.getThread);

module.exports = router;
