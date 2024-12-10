const express = require('express');
const { body, validationResult } = require('express-validator');
const { authMiddleware, checkRole } = require('../../middleware/auth');
const supabase = require('../../config/supabase');
const logger = require('../../config/logger');

const router = express.Router();

// Get all users (admin only)
router.get('/', 
  authMiddleware, 
  checkRole(['administrador']), 
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user role (admin only)
router.put('/:id/role',
  authMiddleware,
  checkRole(['administrador']),
  [body('role').isIn(['cliente', 'personal', 'administrador'])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { role } = req.body;

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Get user activity logs
router.get('/:id/activity',
  authMiddleware,
  checkRole(['administrador']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error fetching user activity:', error);
      res.status(500).json({ error: 'Failed to fetch user activity' });
    }
});

module.exports = router;