const express = require('express');
const statsRouter = require('./stats');
const usersRouter = require('./users');
const ordersRouter = require('./orders');
const reservationsRouter = require('./reservations');

const router = express.Router();

router.use('/stats', statsRouter);
router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/reservations', reservationsRouter);

module.exports = router;