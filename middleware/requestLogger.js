
const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  next();
};

module.exports = requestLogger;
