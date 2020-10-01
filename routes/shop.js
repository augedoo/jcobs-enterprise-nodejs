const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

// GET => / => Public
router.get('/', shopController.getIndex);

// GET => /products/:productId => Public
router.get('/products/:productId', shopController.getProduct);

// GET => /cart => Public
router.get('/cart', shopController.getCart);

// POST => /cart => Public
router.post('/cart', shopController.postCart);

// POST => /delete-cart-item => Public
router.post('/delete-cart-item', shopController.postDeleteCartItem);

// GET => /checkout => Public
router.get('/checkout', shopController.getCheckout);

// GET => /orders => Public
router.get('/orders', shopController.getOrders);

// GET => /orders => Public
router.post('/orders', shopController.postOrder);

module.exports = router;
