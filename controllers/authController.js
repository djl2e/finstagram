const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

dotenv.config();

// new user signup
exports.signup_post = [
  body('form-name').trim().isLength({ min: 1 }).escape(),
  body('form-username').trim().isLength({ min: 1 }).escape(),
  body('form-password', 'Minimum password length is 6').trim().isLength({ min: 6 }).escape(),
  body('form-confirm').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const firstWord = error.param.split('-')[1];
      const message = `${firstWord.charAt(0).toUpperCase()
        + firstWord.slice(1)} ${error.msg.toLowerCase()}`;
      return res.status(400).json({ message });
    }

    const name = req.body['form-name'];
    const username = req.body['form-username'];
    const password = req.body['form-password'];
    const confirm = req.body['form-confirm'];
    const description = '';
    const image = 'blank.png';

    if (password !== confirm) {
      return res.status(401).json({
        message: 'Password confirmation different from password.',
      });
    }

    // hash password and save user if not exists
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.json(err);

      User.findOne({ username })
        .exec((err, result) => {
          if (err) return res.json(err);
          if (result) {
            return res.status(409).json({
              message: 'Username already exists.',
            });
          }
          const user = new User({
            name,
            username,
            password: hash,
            description,
            image,
          });
          user.save((err) => {
            if (err) return res.json(err);
            res.status(200).json({
              message: 'Signup successful! Please Log In.',
            });
          });
        });
    });
  },
];

// user login
exports.login_post = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Incorrect username or password.',
        user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) res.json(err);
    });

    // jwt token to remember user login status
    jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
      if (err) return res.status(400).json(err);
      res.status(200).json({
        user,
        token,
      });
    });
  })(req, res, next);
};
