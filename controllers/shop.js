const Product = require('../models/product');

exports.getIndex = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('shop/index', {
      pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
      path: '/',
      products,
    });
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
};
