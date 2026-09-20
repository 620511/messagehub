const prisma = require('../config/prisma');
const { sendPushToStore } = require('./pushService');

async function findOrCreateStore(appId, storeExternalId, storeName) {
  let store = await prisma.user.findFirst({
    where: { appId, externalId: storeExternalId, role: 'store' }
  });
  if (!store) {
    store = await prisma.user.create({
      data: { appId, externalId: storeExternalId, name: storeName || 'Loja', role: 'store' }
    });
  }
  return store;
}

async function createOrderNotification({ appId, storeExternalId, storeName, customerName, items, total, address, paymentMethod }) {
  const store = await findOrCreateStore(appId, storeExternalId, storeName);

  const conversation = await prisma.conversation.create({
    data: { appId, members: { create: { userId: store.id } } }
  });

  const content = `🔔 Novo pedido de ${customerName || 'cliente'} — Total: R$ ${total}`;

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      type: 'order_notification',
      content,
      metadata: { items, total, address, paymentMethod, customerName }
    }
  });

  await sendPushToStore(store.id, {
    title: '🔔 Novo pedido',
    body: content
  });

  return { store, conversation, message };
}

async function getConversationMessages(conversationId) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' }
  });
}

async function listStoreConversations(storeUserId) {
  return prisma.conversation.findMany({
    where: { members: { some: { userId: storeUserId } } },
    include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' }
  });
}

async function updateOrderStatus(messageId, status) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  const metadata = { ...(message.metadata || {}), status };
  return prisma.message.update({ where: { id: messageId }, data: { metadata } });
}

async function sendReply({ conversationId, senderId, content }) {
  return prisma.message.create({
    data: { conversationId, senderId, type: 'text', content }
  });
}

module.exports = {
  createOrderNotification,
  getConversationMessages,
  listStoreConversations,
  updateOrderStatus,
  sendReply
};
