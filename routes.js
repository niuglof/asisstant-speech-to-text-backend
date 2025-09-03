
const express = require('express');
const router = express.Router();
const { Item } = require('./models');

// Create
router.post('/items', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Read all
router.get('/items', async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

// Read one
router.get('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Update
router.put('/items/:id', async (req, res) => {
  try {
    const [updated] = await Item.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedItem = await Item.findByPk(req.params.id);
      res.status(200).json(updatedItem);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete
router.delete('/items/:id', async (req, res) => {
  const deleted = await Item.destroy({
    where: { id: req.params.id }
  });
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).send('Item not found');
  }
});

module.exports = router;
