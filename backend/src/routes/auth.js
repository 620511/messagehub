const express = require('express');
const router = express.Router();
const { loginStore } = require('../controllers/authController');

router.post('/login', loginStore);

module.exports = router;
