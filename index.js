require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const externalRoutes = require('./routes/externalRoutes');
const authenticateToken = require('./middleware/auth');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./config/logger');

const app = express();
const port = 3000;

logger.info(`JWT_SECRET loaded: ${process.env.JWT_SECRET}`);

app.use(bodyParser.json());
app.use(requestLogger);

// Public routes (e.g., login)
app.use('/api', authRoutes);

// API Key protected routes
app.use('/api', externalRoutes);

// JWT protected routes
app.use('/api', authenticateToken, userRoutes);
app.use('/api', authenticateToken, subscriptionRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Service API');
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});