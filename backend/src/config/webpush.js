const webpush = require('web-push');
require('dotenv').config();

// .trim() remove espaço/quebra de linha invisível que o painel do Render
// (ou qualquer copiar/colar) pode deixar no valor da variável de ambiente.
const subject = process.env.VAPID_SUBJECT?.trim();
const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();

if (!subject || !publicKey || !privateKey) {
  throw new Error(
    'VAPID_SUBJECT, VAPID_PUBLIC_KEY ou VAPID_PRIVATE_KEY não estão definidas. ' +
    'Confira as variáveis de ambiente.'
  );
}

if (publicKey.length !== 87) {
  console.warn(`⚠️ VAPID_PUBLIC_KEY tem ${publicKey.length} caracteres (esperado: 87). Confira se não sobrou espaço/quebra de linha ao colar.`);
}

if (privateKey.length !== 43) {
  console.warn(`⚠️ VAPID_PRIVATE_KEY tem ${privateKey.length} caracteres (esperado: 43). Confira se não sobrou espaço/quebra de linha ao colar.`);
}

webpush.setVapidDetails(subject, publicKey, privateKey);

module.exports = webpush;