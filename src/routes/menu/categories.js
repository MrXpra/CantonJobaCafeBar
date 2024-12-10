const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware, checkRole } = require('../../middleware/auth');
const supabase = require('../../config/supabase');
const logger = require('../../config/logger');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category (admin only)
router.post('/',
  authMiddleware,
  checkRole(['administrador']),
  [
    body('name').notEmpty().trim(),
    body('parent_id').optional().isInt()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, parent_id } = req.body;
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, parent_id }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      logger.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
);

// Update category (admin only)
router.put('/:id',
  authMiddleware,
  checkRole(['administrador']),
  [
    body('name').notEmpty().trim(),
    body('parent_id').optional().isInt()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, parent_id } = req.body;
      const { data, error } = await supabase
        .from('categories')
        .update({ name, parent_id })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
);

// Delete category (admin only)
router.delete('/:id',
  authMiddleware,
  checkRole(['administrador']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
);

module.exports = router;