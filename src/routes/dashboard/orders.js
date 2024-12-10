const express = require('express');
const { authMiddleware, checkRole } = require('../../middleware/auth');
const supabase = require('../../config/supabase');
const logger = require('../../config/logger');

const router = express.Router();

// Get all orders with details
router.get('/',
  authMiddleware,
  checkRole(['administrador', 'personal']),
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:user_profiles(full_name),
          items:order_items(
            quantity,
            price,
            menu_item:menu_items(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update order status
router.put('/:id/status',
  authMiddleware,
  checkRole(['administrador', 'personal']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
});

module.exports = router;