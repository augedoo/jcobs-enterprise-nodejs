exports.getIndex = (req, res) => {
  res.render('index', {
    pageTitle: 'JCOBs Enterprise | Online Shop For Men and Women Clothing',
    path: '/',
  });
};
