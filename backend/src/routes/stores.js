const express = require('express');
const router = express.Router();
const { createStore } = require('../controllers/storeController');

// POST /stores  (protegido por x-api-key da plataforma dona da loja)
router.post('/', createStore);

module.exports = router;
