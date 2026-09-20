const express = require('express');
const router = express.Router();
const { myConversations, conversationMessages, respondOrder, reply, subscribePush } = require('../controllers/storeDashboardController');

router.get('/conversations', myConversations);
router.get('/conversations/:conversationId/messages', conversationMessages);
router.post('/orders/:messageId/status', respondOrder);
router.post('/conversations/:conversationId/reply', reply);
router.post('/push-subscribe', subscribePush);

module.exports = router;
