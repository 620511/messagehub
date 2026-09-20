const express = require('express');
const router = express.Router();
const { orderNotification, listMessages } = require('../controllers/messageController');

router.post('/order-notification', orderNotification);
router.get('/:conversationId', listMessages);

module.exports = router;
