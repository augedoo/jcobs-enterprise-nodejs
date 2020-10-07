const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const User = require('../models/user');
const colors = require('colors');

const mailer = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    pageTitle: 'JCOBs Enterprise | Signup',
    path: '/auth/signup',
    errorMessage: message,
  });
};

exports.getLogin = (req, res, next) => {
  // Todo: Prevent going back with back btn after logging in

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  console.log(colors.red(req.flash('error')));
  res.render('auth/login', {
    pageTitle: 'JCOBs Enterprise | Login',
    path: '/auth/login',
    errorMessage: message,
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.render('auth/signup', {
      pageTitle: 'JCOBs Enterprise | Signup',
      path: '/auth/signup',
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email,
      password: hashedPassword,
    });
    req.session.user = user;
    req.session.isLoggedIn = true;
    const message = {
      to: email,
      from: 'augedoo@gmail.com',
      subject: 'Account created successfully!',
      html: '<h1>Your account creation was successful.</h1>',
    };
    res.redirect('/auth/login');
    await mailer.sendMail(message);
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0]);
    return res.render('auth/login', {
      pageTitle: 'JCOBs Enterprise | Login',
      path: '/auth/login',
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash('error', 'Invalid E-Mail or Password.');
      return res.redirect('/auth/login');
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      return req.session.save(() => {
        res.redirect('/');
      });
    }
    req.flash('error', 'Invalid E-Mail or Password.');
    res.redirect('/auth/login');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    console.log('Session destroyed'.bgGreen);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  let err;
  if (message.length > 0) {
    message = message[0];
    err = message === 'No account with that E-Mail.';
  } else {
    message = null;
  }
  res.render('auth/reset', {
    pageTitle: 'JCOBs Enterprise | Reset',
    path: '/auth/reset',
    errorMessage: message,
    isSuccessMessage: !err,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0]);
    return res.render('auth/reset', {
      pageTitle: 'JCOBs Enterprise | Reset',
      path: '/auth/reset',
      errorMessage: errors.array()[0].msg,
      isSuccessMessage: false,
    });
  }
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        return console.log(err);
      }
      const token = buffer.toString('hex');
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        req.flash('error', 'No account with that E-Mail.');
        return res.redirect('/auth/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000; //1hr in milliseconds;
      const result = await user.save();
      console.log(user, result);
      const message = {
        to: email,
        from: 'augedoo@gmail.com',
        subject: 'Password Reset!',
        html: `
          <p>
            Click on this <a href="http://localhost:5000/auth/change-password/${token}">link</a> to continue password reset
          </p>`,
      };
      req.flash(
        'error',
        `A reset link is sent to ${email}. Please use it to reset your password.`
      );
      res.redirect('/auth/reset');
      await mailer.sendMail(message);
    });
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

exports.getChangePassword = (req, res, next) => {
  const token = req.params.token;
  let message = req.flash('error');
  let err;
  if (message.length > 0) {
    message = message[0];
    err = message === 'No account with that E-Mail.';
  } else {
    message = null;
  }
  res.render('auth/change-password', {
    pageTitle: 'JCOBs Enterprise | Change Password',
    path: '/auth/change-password',
    resetToken: token,
    errorMessage: message,
    isSuccessMessage: !err,
  });
};

exports.postChangePassword = async (req, res, next) => {
  const password = req.body.password;
  const token = req.body.token;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0]);
    return res.render('auth/change-password', {
      pageTitle: 'JCOBs Enterprise | Change Password',
      path: '/auth/change-password',
      errorMessage: errors.array()[0].msg,
      resetToken: token,
      isSuccessMessage: false,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOne({ resetToken: token });
    if (user.resetToken === token && Date.now() < user.resetTokenExpiration) {
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      await user.save();
      const message = {
        to: user.email,
        from: 'augedoo@gmail.com',
        subject: 'Password Reset Successful!',
        html: '<h1>Your account password has changed.</h1>',
      };
      res.redirect('/auth/login');
      return await mailer.sendMail(message);
    }

    return res.redirect('/auth/reset');
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};
