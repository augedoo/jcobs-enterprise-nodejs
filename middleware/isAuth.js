const isAuth = (req, res, next) => {
  const loggedIn = req.session.isLoggedIn;
  if (!loggedIn) {
    return res.redirect('/auth/login');
  }
  next();
};

module.exports = isAuth;
