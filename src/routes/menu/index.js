const express = require('express');
const categoriesRouter = require('./categories');
const itemsRouter = require('./items');

const router = express.Router();

router.use('/categories', categoriesRouter);
router.use('/items', itemsRouter);

module.exports = router;