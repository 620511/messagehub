const express = require('express');
const router = express.Router();
const { registerApp } = require('../controllers/appController');

// POST /apps  { name: "PetDelivery-CE" }
router.post('/', registerApp);

module.exports = router;
