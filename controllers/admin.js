exports.getAddProduct = (req, res) => {
  res.render('add-product', {
    pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
    path: '/',
  });
};

exports.postAddProduct = (req, res) => {
  const name = req.body.name;
  console.log(name);
  console.log('Added Product...');
  res.redirect('/');
};
