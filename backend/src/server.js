const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const apiKeyAuth = require('./middleware/apiKeyAuth');
const jwtAuth = require('./middleware/jwtAuth');

const appsRoutes = require('./routes/apps');
const storesRoutes = require('./routes/stores');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const storeRoutes = require('./routes/store');
const setupSockets = require('./socket/index');

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');

const io = new Server(server, { cors: { origin: allowedOrigins } });
app.set('io', io);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use('/apps', appsRoutes);
app.use('/stores', apiKeyAuth, storesRoutes);
app.use('/auth', authRoutes);
app.use('/messages', apiKeyAuth, messagesRoutes);
app.use('/store', jwtAuth, storeRoutes);

app.get('/', (req, res) => res.json({ status: 'MessageHub rodando' }));

setupSockets(io);
server.listen(process.env.PORT || 4000, () => console.log('MessageHub rodando'));
