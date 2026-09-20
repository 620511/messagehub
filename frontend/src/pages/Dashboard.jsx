import { useEffect, useState } from 'react';
import api from '../services/api';
import { connectSocket } from '../services/socket';

export default function Dashboard() {
  const [conversations, setConversations] = useState([]);
  const user = JSON.parse(localStorage.getItem('mh_user') || '{}');

  useEffect(() => {
    api.get('/store/conversations').then((res) => setConversations(res.data));

    const socket = connectSocket(user.id);
    socket.on('new_message', () => {
      api.get('/store/conversations').then((res) => setConversations(res.data));
    });
    socket.on('order_status_updated', () => {
      api.get('/store/conversations').then((res) => setConversations(res.data));
    });

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async (registration) => {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
        });

        api.post('/store/push-subscribe', subscription);
      });
    }

    return () => socket.disconnect();
  }, []);

  async function responder(messageId, status) {
    await api.post(`/store/orders/${messageId}/status`, { status });
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Pedidos — {user.name}</h2>
      {conversations.map((conv) => {
        const lastMsg = conv.messages[0];
        return (
          <div key={conv.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <p>{lastMsg?.content}</p>
            {lastMsg?.type === 'order_notification' && !lastMsg?.metadata?.status && (
              <div>
                <button onClick={() => responder(lastMsg.id, 'accepted')} style={{ marginRight: 8 }}>✅ Aceitar</button>
                <button onClick={() => responder(lastMsg.id, 'rejected')}>❌ Recusar</button>
              </div>
            )}
            {lastMsg?.metadata?.status && <p><strong>Status:</strong> {lastMsg.metadata.status}</p>}
          </div>
        );
      })}
    </div>
  );
}
