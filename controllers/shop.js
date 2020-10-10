const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');
const colors = require('colors');

const Product = require('../models/product');
const pdf = require('../utils/pdf');

exports.getIndex = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
      path: '/',
      products,
    });
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getProduct = async (req, res) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findByPk(prodId);
    res.render('shop/product-detail', {
      pageTitle: 'JCOBs Enterprise | Product Detail',
      path: '/products/product',
      product,
    });
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getCart = async (req, res) => {
  try {
    // > Fetch user cart
    let cart = await req.user.getCart();
    if (!cart) {
      cart = await req.user.createCart();
    }
    const cartProducts = await cart.getProducts();
    const cartProductsCount = await cart.countProducts();
    console.log(cartProducts);
    res.render('shop/cart', {
      pageTitle: 'JCOBs Enterprise | Your Cart',
      path: '/cart',
      productsCount: cartProductsCount,
      products: cartProducts,
    });
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.postCart = async (req, res) => {
  const prodId = req.body.productId;
  try {
    // > Get product to be added to cart by id
    const product = await Product.findByPk(prodId);
    // > Fetch user cart
    let cart = await req.user.getCart();
    if (!cart) {
      cart = await req.user.createCart();
    }
    let newQuantity = 1;
    // > Add product to cart with new quantity
    const hasProductInCart = await cart.hasProduct(product);
    if (hasProductInCart) {
      const products = await cart.getProducts({ where: { id: prodId } });
      const product = products[0];
      newQuantity = product.cartItem.quantity + 1;
      const cartItem = await cart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    } else {
      const cartItem = await cart.addProduct(product, {
        through: {
          quantity: newQuantity,
        },
      });
    }
    res.redirect('/');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.postDeleteCartItem = async (req, res) => {
  const prodId = req.body.productId;
  try {
    const cart = await req.user.getCart();
    let product = await cart.getProducts({ where: { id: prodId } });
    product = product[0];
    const result = await cart.removeProduct(product);
    res.redirect('/cart');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.postOrder = async (req, res) => {
  try {
    // Create order
    const order = await req.user.createOrder();
    // Get Products form cart
    const cart = await req.user.getCart();
    let products = await cart.getProducts();
    // Add cart products to order
    const result = await order.addProducts(
      products.map((p) => {
        /* Add orderItem field to the product
          Sequelize will automatically extract this field for the product
          and set it as the orderItem 
         */
        p.orderItem = { quantity: p.cartItem.quantity };
        return p;
      })
    );
    // Clear the cart
    await cart.setProducts([]);
    res.redirect('/orders');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders({ include: ['products'] });
    orders.forEach(async (order) => {
      console.log(await order.getProducts());
      // for (product in order.products) {
      //   console.log(product.id);
      // }
    });
    res.render('shop/orders', {
      pageTitle: 'JCOBs Enterprise | Orders',
      path: '/orders',
      orders,
    });
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getInvoice = async (req, res, next) => {
  const invoiceId = req.params.orderId;
  const invoicePath = path.join(path.dirname(__dirname), 'data', 'invoices');
  console.log(invoicePath);
  const order = await req.user.getOrders({
    where: { id: invoiceId },
    include: ['products'],
  });

  const products = order[0].products.map((p) => {
    const product = {
      title: p.title,
      price: p.price,
      quantity: p.orderItem.quantity,
    };
    return product;
  });

  const pdfDoc = new pdfDocument({
    info: {
      title: 'JCobs Enterprise Invoice',
      author: 'JCobs Enterprise',
    },
    permissions: {
      printing: 'highResolution',
    },
    pdfVersion: '1.6',
    layout: 'portrait',
    size: [595.28, 841.89],
    margins: {
      top: 72,
      bottom: 72,
      left: 47.64,
      right: 47.64,
    },
  });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'inline; filename="order-' + invoiceId + '.pdf"'
  );

  try {
    pdfDoc.pipe(res);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdf.generateOrderInvoicePdf(pdfDoc, products, order.createdAt);
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getCheckout = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    res.render('shop/checkout', {
      pageTitle: 'JCOBs Enterprise | Checkout',
      path: '/checkout',
      // product,
    });
    // Todo: checkout implementation
    console.log('Continue working on checkout');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};
