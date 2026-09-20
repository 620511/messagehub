function setupSockets(io) {
  io.on('connection', (socket) => {
    socket.on('join_store', (storeId) => socket.join(`store:${storeId}`));
    socket.on('send_message', (payload) => {
      io.to(`store:${payload.store_id}`).emit('new_message', payload);
    });
  });
}

module.exports = setupSockets;
