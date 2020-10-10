const express = require('express');
const { check } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// Prepended with /admin
router.get('/add-product', isAuth, adminController.getAddProduct);

// POST => /admin/add-product
router.post(
  '/add-product',
  [
    check('title', 'product title can not be less that  characters')
      .isAscii()
      .isLength({ min: 3 })
      .trim(),
    check('price').isFloat().withMessage('Please enter a decimal number.'),
    check(
      'description',
      'Product description should be 5 to 800 characters long.'
    )
      .isLength({ min: 5 })
      .trim(),
  ],
  adminController.postAddProduct
);

// GET => /admin/products
router.get('/products', isAuth, adminController.getProducts);

// GET => /admin/edit-product/:productId
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// POST => /admin/edit-product
router.post(
  '/edit-product',
  isAuth,
  [
    check('title', 'Product title can not be less that  characters')
      .isAscii()
      .isLength({ min: 3 })
      .trim(),
    check('price').isFloat().withMessage('Please enter a decimal number.'),
    check(
      'description',
      'Product description should be at least 5 characters long.'
    )
      .isLength({ min: 5 })
      .trim(),
  ],
  adminController.postEditProduct
);

// POST => /admin/delete-product
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
