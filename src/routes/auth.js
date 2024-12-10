const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const logger = require('../config/logger');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty(),
    body('role').isIn(['cliente', 'personal', 'administrador'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, fullName, role } = req.body;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: fullName,
            role: role || 'cliente'
          }
        ]);

      if (profileError) throw profileError;

      // Log activity
      await supabase.from('activity_logs').insert([{
        user_id: authData.user.id,
        action: 'register',
        description: 'User registration'
      }]);

      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert([{
        user_id: data.user.id,
        action: 'login',
        description: 'User login'
      }]);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      res.json({
        user: { ...data.user, profile },
        session: data.session
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
);

// Get current user profile
router.get('/me',
  authMiddleware,
  async (req, res) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (error) throw error;

      res.json({
        user: req.user,
        profile
      });
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }
);

// Update user profile
router.put('/profile',
  authMiddleware,
  [
    body('fullName').optional().notEmpty(),
    body('phone_number').optional(),
    body('address').optional(),
    body('preferences').optional().isObject()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updates = {};
      if (req.body.fullName) updates.full_name = req.body.fullName;
      if (req.body.phone_number) updates.phone_number = req.body.phone_number;
      if (req.body.address) updates.address = req.body.address;
      if (req.body.preferences) updates.preferences = req.body.preferences;

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', req.user.id)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert([{
        user_id: req.user.id,
        action: 'profile_update',
        description: 'Profile update'
      }]);

      res.json(data);
    } catch (error) {
      logger.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

module.exports = router;