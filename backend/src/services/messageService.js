const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const supabase = require('../config/supabase');
const ApiError = require('../utils/ApiError');

const MESSAGES_FILE = path.join(__dirname, '../../../uploads/messages.json');

function ensureDataDir() {
  const dir = path.dirname(MESSAGES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]), 'utf8');
  }
}

function readAllMessages() {
  try {
    ensureDataDir();
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading messages file:', err);
    return [];
  }
}

function writeAllMessages(messages) {
  try {
    ensureDataDir();
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing messages file:', err);
  }
}

async function getUserInfo(userId) {
  try {
    const { data } = await supabase
      .from('users')
      .select('id, name, email, avatar_url')
      .eq('id', userId)
      .maybeSingle();
    if (data) return data;
  } catch (err) {}
  return { id: userId, name: 'Traveler', email: '', avatar_url: null };
}

exports.sendMessage = async (senderId, recipientId, content) => {
  if (!recipientId) throw new ApiError(400, 'Recipient ID is required');
  const text = (content || '').trim();
  if (!text) throw new ApiError(400, 'Message content cannot be empty');
  if (senderId === recipientId) throw new ApiError(400, 'Cannot message yourself');

  const messages = readAllMessages();
  const newMsg = {
    id: crypto.randomUUID(),
    sender_id: senderId,
    recipient_id: recipientId,
    content: text,
    created_at: new Date().toISOString(),
    read_at: null
  };

  messages.push(newMsg);
  writeAllMessages(messages);

  const recipient = await getUserInfo(recipientId);
  return {
    ...newMsg,
    recipient
  };
};

exports.getUnreadCount = async (userId) => {
  if (!userId) return 0;
  const messages = readAllMessages();
  const unread = messages.filter(m => m.recipient_id === userId && !m.read_at);
  return unread.length;
};

exports.getConversations = async (userId) => {
  if (!userId) return [];
  const messages = readAllMessages();

  // Find all messages involving this user
  const userMessages = messages.filter(
    m => m.sender_id === userId || m.recipient_id === userId
  );

  // Group by contactId
  const contactsMap = {};
  userMessages.forEach(m => {
    const contactId = m.sender_id === userId ? m.recipient_id : m.sender_id;
    if (!contactsMap[contactId]) {
      contactsMap[contactId] = {
        contactId,
        messages: [],
        unreadCount: 0
      };
    }
    contactsMap[contactId].messages.push(m);
    if (m.recipient_id === userId && !m.read_at) {
      contactsMap[contactId].unreadCount++;
    }
  });

  const conversationList = [];
  for (const contactId of Object.keys(contactsMap)) {
    const group = contactsMap[contactId];
    group.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const lastMessage = group.messages[group.messages.length - 1];
    const contactInfo = await getUserInfo(contactId);

    conversationList.push({
      contact: contactInfo,
      lastMessage,
      unreadCount: group.unreadCount
    });
  }

  // Sort conversations by most recent message
  conversationList.sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));
  return conversationList;
};

exports.getThread = async (userId, contactId) => {
  if (!userId || !contactId) return { contact: null, messages: [] };
  const messages = readAllMessages();

  let modified = false;
  // Mark incoming messages as read
  messages.forEach(m => {
    if (m.sender_id === contactId && m.recipient_id === userId && !m.read_at) {
      m.read_at = new Date().toISOString();
      modified = true;
    }
  });

  if (modified) {
    writeAllMessages(messages);
  }

  const thread = messages.filter(
    m => (m.sender_id === userId && m.recipient_id === contactId) ||
         (m.sender_id === contactId && m.recipient_id === userId)
  );

  thread.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const contact = await getUserInfo(contactId);

  return {
    contact,
    messages: thread
  };
};
