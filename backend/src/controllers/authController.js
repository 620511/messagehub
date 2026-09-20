const { login } = require('../services/authService');

async function loginStore(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

  const result = await login(email, password);
  if (!result) return res.status(401).json({ error: 'Credenciais inválidas' });

  res.json(result);
}

module.exports = { loginStore };
