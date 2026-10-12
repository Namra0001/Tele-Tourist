const messageService = require('../services/messageService');

exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { recipient_id, content } = req.body;
    const message = await messageService.sendMessage(senderId, recipient_id, content);
    res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await messageService.getUnreadCount(userId);
    res.json({ success: true, unread_count: count });
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversations = await messageService.getConversations(userId);
    res.json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
};

exports.getThread = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    const data = await messageService.getThread(userId, contactId);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};
