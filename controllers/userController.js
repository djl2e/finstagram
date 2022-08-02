const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');

dotenv.config();

exports.signup_post = (req, res, next) => [

];

exports.login_post = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Incorrect username or password',
        user,
      });
    }

    jwt.sign({ user }, process.env.SECRET_KEY, (err, token) => {
      if (err) return res.status(400).json(err);
      res.json({ user, token });
    });
  });
};
