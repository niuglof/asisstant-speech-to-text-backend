const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/subscription');
const logger = require('../config/logger');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      logger.error('Login attempt: All input is required', { body: req.body });
      return res.status(400).send('All input is required');
    }

    const user = await User.findOne({ where: { email } });
    
    logger.info('Login attempt', { email, userFound: !!user });
    logger.info('Password comparison', { passwordProvided: !!password, passwordHashExists: !!(user && user.password_hash) });
    logger.info('Password comparison result', { isMatch: user && (await bcrypt.compare(password, user.password_hash)) });
    logger.info('Password - Hash', { password: password, hash: user.password_hash });
    logger.info('Password - Hash (new)', { hash: await bcrypt.hash(password, 10) });
    
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: '2h',
        }
      );

      logger.info('User logged in successfully', { userId: user.id, email: user.email });
      return res.status(200).json({ token });
    }

    logger.warn('Login attempt: Invalid Credentials', { email });
    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    logger.error('Login error', { error: err.message, body: req.body });
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;