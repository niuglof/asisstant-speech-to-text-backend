const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models/subscription');
const logger = require('../config/logger');

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { password_hash, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password_hash, 10); // Hash the password
    const user = await User.create({ ...userData, password_hash: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    logger.error('Error creating user', { error: error.message, body: req.body });
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    logger.error('Error getting all users', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error('Error getting user by id', { error: error.message, params: req.params });
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { password_hash, ...userData } = req.body;
    let updateData = { ...userData };

    if (password_hash) {
      updateData.password_hash = await bcrypt.hash(password_hash, 10);
    }

    const [updated] = await User.update(updateData, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error('Error updating user', { error: error.message, params: req.params, body: req.body });
    res.status(400).json({ error: error.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    logger.error('Error deleting user', { error: error.message, params: req.params });
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;