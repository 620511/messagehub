const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

async function registerStore({ appId, externalId, name, email, password }) {
  const hashed = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findFirst({ where: { appId, externalId, role: 'store' } });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: { name, email, password: hashed }
    });
  }

  return prisma.user.create({
    data: { appId, externalId, name, email, password: hashed, role: 'store' }
  });
}

module.exports = { registerStore };
