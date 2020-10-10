const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// GET => / => Public
router.get('/', shopController.getIndex);

// GET => /products/:productId => Public
router.get('/products/:productId', shopController.getProduct);

// GET => /cart => Public
router.get('/cart', isAuth, shopController.getCart);

// POST => /cart => Public
router.post('/cart', isAuth, shopController.postCart);

// POST => /delete-cart-item => Public
router.post('/delete-cart-item', isAuth, shopController.postDeleteCartItem);

// GET => /checkout => Public
router.get('/checkout', isAuth, shopController.getCheckout);

// GET => /orders => Public
router.get('/orders', isAuth, shopController.getOrders);

// GET => /orders => Public
router.post('/orders', isAuth, shopController.postOrder);

// GET => /orders => Public
router.get('/order-invoice/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
