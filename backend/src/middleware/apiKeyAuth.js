const prisma = require('../config/prisma');

async function apiKeyAuth(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (!apiKey) return res.status(401).json({ error: 'x-api-key ausente' });

  const record = await prisma.apiKey.findUnique({ where: { key: apiKey } });
  if (!record || !record.active) {
    return res.status(401).json({ error: 'API key inválida' });
  }

  req.appId = record.appId;
  next();
}

module.exports = apiKeyAuth;
