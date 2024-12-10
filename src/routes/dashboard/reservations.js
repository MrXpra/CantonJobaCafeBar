const express = require('express');
const { authMiddleware, checkRole } = require('../../middleware/auth');
const supabase = require('../../config/supabase');
const logger = require('../../config/logger');

const router = express.Router();

// Get all reservations
router.get('/',
  authMiddleware,
  checkRole(['administrador', 'personal']),
  async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          user:user_profiles(full_name)
        `)
        .order('reservation_datetime', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      logger.error('Error fetching reservations:', error);
      res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// Update reservation status
router.put('/:id/status',
  authMiddleware,
  checkRole(['administrador', 'personal']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Create notification for the user
      if (data) {
        await supabase.from('notifications').insert([{
          user_id: data.user_id,
          type: 'reservacion',
          message: `Tu reservación ha sido ${status}`
        }]);
      }

      res.json(data);
    } catch (error) {
      logger.error('Error updating reservation status:', error);
      res.status(500).json({ error: 'Failed to update reservation status' });
    }
});

module.exports = router;