const { registerStore } = require('../services/storeService');

async function createStore(req, res) {
  try {
    const { external_id, name, email, password } = req.body;
    if (!external_id || !email || !password) {
      return res.status(400).json({ error: 'external_id, email e password são obrigatórios' });
    }

    const store = await registerStore({ appId: req.appId, externalId: external_id, name, email, password });
    res.status(201).json({ id: store.id, name: store.name, email: store.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar loja' });
  }
}

module.exports = { createStore };
