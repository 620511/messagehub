const { createOrderNotification, getConversationMessages } = require('../services/messageService');

async function orderNotification(req, res) {
  try {
    const { store_external_id, store_name, customer_name, items, total, address, payment_method } = req.body;
    if (!store_external_id) return res.status(400).json({ error: 'store_external_id é obrigatório' });

    const { store, conversation, message } = await createOrderNotification({
      appId: req.appId,
      storeExternalId: store_external_id,
      storeName: store_name,
      customerName: customer_name,
      items, total, address,
      paymentMethod: payment_method
    });

    req.app.get('io').to(`store:${store.id}`).emit('new_message', { conversation_id: conversation.id, message });

    res.status(201).json({ conversation, message, store_id: store.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar notificação de pedido' });
  }
}

async function listMessages(req, res) {
  const messages = await getConversationMessages(req.params.conversationId);
  res.json(messages);
}

module.exports = { orderNotification, listMessages };
