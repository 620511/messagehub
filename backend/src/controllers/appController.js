const { createApp } = require('../services/appService');

async function registerApp(req, res) {
  if (req.header('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Não autorizado' });
  }
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name é obrigatório' });

  try {
    const result = await createApp(name);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar app' });
  }
}

module.exports = { registerApp };
