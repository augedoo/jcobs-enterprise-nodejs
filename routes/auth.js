const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.get('/login', authController.getLogin);

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ where: { email: value } });
          if (user) {
            return Promise.reject(
              'E-Mail already exist. Please enter a different one.'
            );
          }
        } catch (err) {
          console.log(err.red);
        }
      }),
    body(
      'password',
      'Password should contain only numbers and letters and at least 8 characters long.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body(
      'password',
      'Password should contain only numbers and letters and at least 8 characters long.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post(
  '/reset',
  body('email').isEmail().withMessage('Please enter a valid email'),
  authController.postReset
);

router.get('/change-password/:token', authController.getChangePassword);

router.post(
  '/change-password',
  body(
    'password',
    'Password should contain only numbers and letters and at least 8 characters long.'
  )
    .isLength({ min: 8 })
    .isAlphanumeric(),
  authController.postChangePassword
);

module.exports = router;
