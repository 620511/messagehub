const { listStoreConversations, getConversationMessages, updateOrderStatus, sendReply } = require('../services/messageService');
const { saveSubscription } = require('../services/pushService');

async function myConversations(req, res) {
  const conversations = await listStoreConversations(req.userId);
  res.json(conversations);
}

async function conversationMessages(req, res) {
  const messages = await getConversationMessages(req.params.conversationId);
  res.json(messages);
}

async function respondOrder(req, res) {
  const { status } = req.body;
  const message = await updateOrderStatus(req.params.messageId, status);
  req.app.get('io').to(`store:${req.userId}`).emit('order_status_updated', message);
  res.json(message);
}

async function reply(req, res) {
  const message = await sendReply({
    conversationId: req.params.conversationId,
    senderId: req.userId,
    content: req.body.content
  });
  req.app.get('io').to(`store:${req.userId}`).emit('new_message', { conversation_id: req.params.conversationId, message });
  res.status(201).json(message);
}

async function subscribePush(req, res) {
  await saveSubscription(req.userId, req.body);
  res.status(201).json({ ok: true });
}

module.exports = { myConversations, conversationMessages, respondOrder, reply, subscribePush };
