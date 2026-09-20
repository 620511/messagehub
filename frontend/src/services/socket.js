import { io } from 'socket.io-client';

let socket;

export function connectSocket(storeId) {
  socket = io(import.meta.env.VITE_MESSAGEHUB_URL);
  socket.on('connect', () => socket.emit('join_store', storeId));
  return socket;
}

export function getSocket() {
  return socket;
}
