const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// GET => / => Public
router.get('/', shopController.getIndex);

module.exports = router;
