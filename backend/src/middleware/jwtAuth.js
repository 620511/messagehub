const jwt = require('jsonwebtoken');

function jwtAuth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  try {
    const payload = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.userId = payload.userId;
    req.appId = payload.appId;
    req.role = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = jwtAuth;
