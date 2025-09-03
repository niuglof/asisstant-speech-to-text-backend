
const express = require('express');
const router = express.Router();
const authenticateApiKey = require('../middleware/apiKeyAuth');
const logger = require('../config/logger');

// Example protected external route
router.get('/external/status', authenticateApiKey, (req, res) => {
  logger.info('External status endpoint accessed', { apiKeyId: req.apiKey.id });
  res.status(200).json({ message: 'External API is healthy', authenticatedBy: req.apiKey.description });
});

// You can add more external routes here that require API Key authentication

module.exports = router;
