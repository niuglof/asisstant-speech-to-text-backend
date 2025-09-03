const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    logger.warn('Authentication attempt: No token provided', { ip: req.ip });
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.error('Token verification error', { error: err.message, token: token, ip: req.ip });
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    logger.info('Token verified successfully', { userId: user.user_id, email: user.email });
    next();
  });
};

module.exports = authenticateToken;