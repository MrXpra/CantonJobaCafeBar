const express = require('express');
const { authMiddleware, checkRole } = require('../../middleware/auth');
const supabase = require('../../config/supabase');
const logger = require('../../config/logger');

const router = express.Router();

router.get('/', authMiddleware, checkRole(['administrador', 'personal']), async (req, res) => {
  try {
    const [orders, reservations, users, menuItems] = await Promise.all([
      supabase.from('orders').select('*'),
      supabase.from('reservations').select('*'),
      supabase.from('user_profiles').select('*'),
      supabase.from('menu_items').select('*')
    ]);

    const stats = {
      totalOrders: orders.data?.length || 0,
      totalReservations: reservations.data?.length || 0,
      totalUsers: users.data?.length || 0,
      totalMenuItems: menuItems.data?.length || 0,
      recentOrders: orders.data?.slice(-5) || [],
      recentReservations: reservations.data?.slice(-5) || []
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;