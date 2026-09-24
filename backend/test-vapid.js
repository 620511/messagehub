require('dotenv').config();

console.log('PUBLIC:', JSON.stringify(process.env.VAPID_PUBLIC_KEY));
console.log('PUBLIC length:', process.env.VAPID_PUBLIC_KEY?.length);
console.log('PRIVATE:', JSON.stringify(process.env.VAPID_PRIVATE_KEY));
console.log('PRIVATE length:', process.env.VAPID_PRIVATE_KEY?.length);

const webpush = require('web-push');
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
console.log('DEU CERTO ✅');
