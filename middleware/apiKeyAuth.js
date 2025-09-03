
const { ApiKey } = require('../models/subscription');
const logger = require('../config/logger');

const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    logger.warn('API Key authentication attempt: No API Key provided', { ip: req.ip });
    return res.status(401).send('API Key is required');
  }

  try {
    const foundKey = await ApiKey.findOne({ where: { key: apiKey, is_active: true } });

    if (!foundKey) {
      logger.warn('API Key authentication attempt: Invalid or inactive API Key', { apiKey: apiKey, ip: req.ip });
      return res.status(403).send('Invalid or inactive API Key');
    }

    req.apiKey = foundKey; // Attach the API Key object to the request
    logger.info('API Key authenticated successfully', { apiKeyId: foundKey.id, description: foundKey.description });
    next();
  } catch (error) {
    logger.error('API Key authentication error', { error: error.message, apiKey: apiKey, ip: req.ip });
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = authenticateApiKey;
