exports.get404 = (req, res) => {
  res.render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
  });
};
