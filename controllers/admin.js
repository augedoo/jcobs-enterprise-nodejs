const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/edit-product', {
    pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
    path: '/',
    editMode: false,
    hasError: false,
    product: null,
    errorMessage: message,
    errorFields: [],
  });
};

exports.postAddProduct = async (req, res) => {
  const title = req.body.title,
    price = req.body.price,
    imageUrl = req.body.imageUrl,
    category = req.body.category,
    description = req.body.description;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
      path: '/',
      editMode: false,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: {
        title,
        price,
        imageUrl,
        category,
        description,
      },
      errorFields: errors.array(),
    });
  }
  try {
    const product = await req.user.createProduct({
      title,
      price,
      imageUrl,
      category,
      description,
    });
    console.log('Added Product...');
    res.redirect('/');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await req.user.getProducts();
    res.render('admin/products', {
      pageTitle: 'JCOBs Enterprise | Your Products',
      path: '/admin/products',
      products,
    });
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.postDeleteProduct = async (req, res) => {
  try {
    const prodId = req.body.productId;
    const result = await Product.destroy({
      where: { id: prodId, UserId: req.user.id },
    });
    res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getEditProduct = async (req, res) => {
  const prodId = req.params.productId;
  const editMode = req.query.edit;
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  try {
    const product = await Product.findByPk(prodId);
    if (editMode) {
      res.render('admin/edit-product', {
        pageTitle: 'JCOBs Enterprise | Edit Product',
        path: '/',
        editMode,
        product,
        hasError: false,
        errorMessage: message,
        errorFields: [],
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.postEditProduct = async (req, res) => {
  const prodId = req.body.productId;
  console.log('This is the product id'.red, prodId);

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
      path: '/',
      editMode: true,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: {
        id: prodId,
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        category: req.body.category,
        description: req.body.description,
      },
      errorFields: errors.array(),
    });
  }
  try {
    const product = await Product.findByPk(prodId);
    if (product.userId !== req.user.id) {
      return res.redirect('/admin/products');
    }
    product.title = req.body.title;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.category = req.body.category;
    product.description = req.body.description;
    await product.save();
    return res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};
