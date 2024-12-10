const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware, checkRole } = require('../../middleware/auth');
const supabase = require('../../config/supabase');
const logger = require('../../config/logger');

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(name)
      `)
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    logger.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(data);
  } catch (error) {
    logger.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// Create menu item (admin only)
router.post('/',
  authMiddleware,
  checkRole(['administrador']),
  [
    body('name').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('description').optional().trim(),
    body('category_id').isInt(),
    body('dietary_tags').isArray(),
    body('is_available').isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { data, error } = await supabase
        .from('menu_items')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      logger.error('Error creating menu item:', error);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  }
);

// Update menu item (admin only)
router.put('/:id',
  authMiddleware,
  checkRole(['administrador']),
  [
    body('name').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('description').optional().trim(),
    body('category_id').optional().isInt(),
    body('dietary_tags').optional().isArray(),
    body('is_available').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { data, error } = await supabase
        .from('menu_items')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error updating menu item:', error);
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  }
);

// Delete menu item (admin only)
router.delete('/:id',
  authMiddleware,
  checkRole(['administrador']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting menu item:', error);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  }
);

module.exports = router;