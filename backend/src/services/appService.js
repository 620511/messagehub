const crypto = require('crypto');
const prisma = require('../config/prisma');

async function createApp(name) {
  const app = await prisma.app.create({ data: { name } });
  const apiKey = crypto.randomBytes(24).toString('hex');
  await prisma.apiKey.create({ data: { appId: app.id, key: apiKey } });
  return { app, api_key: apiKey };
}

module.exports = { createApp };
