const prisma = require('../config/prisma');
const webpush = require('../config/webpush');

async function saveSubscription(userId, subscription) {
  const { endpoint, keys } = subscription;
  return prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId, p256dh: keys.p256dh, auth: keys.auth },
    create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth }
  });
}

async function sendPushToStore(storeId, payload) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId: storeId } });

  await Promise.all(subs.map((sub) =>
    webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload)
    ).catch((err) => {
      if (err.statusCode === 410 || err.statusCode === 404) {
        return prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
      console.error('Erro ao enviar push:', err.message);
    })
  ));
}

module.exports = { saveSubscription, sendPushToStore };
