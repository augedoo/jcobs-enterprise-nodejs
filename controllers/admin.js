const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
    path: '/',
    editMode: false,
  });
};

exports.postAddProduct = async (req, res) => {
  const title = req.body.title,
    price = req.body.price,
    imageUrl = req.body.imageUrl,
    category = req.body.category,
    description = req.body.description;
  const product = await req.user.createProduct({
    title,
    price,
    imageUrl,
    category,
    description,
  });
  console.log('Added Product...');
  res.redirect('/');
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
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res) => {
  try {
    const prodId = req.body.productId;
    const result = await Product.destroy({
      where: { id: prodId, UserId: req.user.id },
    });
    // const product = await req.user.getProducts({ where: { id: prodId } });
    // const result = await req.user.removeProduct(product);
    console.log(result);
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res) => {
  try {
    const prodId = req.params.productId;
    const editMode = req.query.edit;
    const product = await Product.findByPk(prodId);
    if (editMode) {
      res.render('admin/edit-product', {
        pageTitle: 'JCOBs Enterprise | Edit Product',
        path: '/',
        editMode,
        product,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res) => {
  try {
    const prodId = req.body.productId;

    const product = await Product.findByPk(prodId);
    product.title = req.body.title;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.category = req.body.category;
    product.description = req.body.description;

    const result = await product.save();
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};
