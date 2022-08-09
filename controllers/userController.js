const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Follow = require('../models/follow');

dotenv.config();

// search for another user
// username that starts with keyword gets precedence
// next is username that contains the keyword
exports.search = [
  body('search').trim().escape(),
  (req, res, next) => {
    const { search } = req.body;
    const { username } = req.user;
    User.find({ username: new RegExp(`^${search}`, 'i') })
      .sort({ username: 1 })
      .limit(20)
      .exec((err, initialSearch) => {
        if (err) res.json(err);
        if (initialSearch.length === 20) {
          res.json(initialSearch);
        }
        const remainingLength = 20 - initialSearch.length;
        User.find({ username: new RegExp(`.+${search}`, 'i') })
          .sort({ username: 1 })
          .limit(remainingLength)
          .exec((err, remainingSearch) => {
            if (err) res.json(err);
            const finalSearch = initialSearch.concat(...remainingSearch)
              .filter((user) => user.username !== username);
            res.json(finalSearch);
          });
      });
  },
];

// get user info (including user following, followers, post)
exports.user = (req, res, next) => {
  User.findById(req.params.id)
    .populate('following')
    .populate('followers')
    .populate('posts')
    .exec((err, user) => {
      if (err) res.json(err);
      if (user === null) {
        return res.status(404).json({
          message: 'User not found',
          user,
        });
      }
      res.json({
        user,
        following: user.following,
        followers: user.followers,
        posts: user.posts,
      });
    });
};

// get current user id
exports.profile = async (req, res, next) => res.json({ id: req.user._id });

// post (submit) form for updating user info
exports.update_post = [
  body('form-name').trim().isLength({ min: 1 }).escape(),
  body('form-password', 'Minimum password length is 6').trim().isLength({ min: 6 }).escape(),
  body('form-confirm').trim().escape(),
  body('form-description').trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.json({ errors: errors.array() });

    const name = req.body['form-name'];
    const password = req.body['form-password'];
    const confirm = req.body['form-confirm'];
    const description = req.body['form-description'];

    if (password !== confirm) {
      return res.status(401).json({
        error: 'Password confirmation different from password',
      });
    }

    const { user } = req;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) res.json(err);
      const updatedUserInfo = {
        name,
        password: hash,
        description,
      };

      User.findByIdAndUpdate(user._id, updatedUserInfo, {}, (err, updatedUser) => {
        if (err) return res.json(err);
        res.json('User info updated'); // check if this is the appropriate json to send
      });
    });
  },
];

// user (id) follow another user (otherid)
exports.follow_post = (req, res, next) => {
  const { user } = req;
  const id = user._id;
  const otherid = mongoose.Types.ObjectId(req.params.otherid);
  Follow.findOne({ following: id, followed: otherid })
    .exec((err, alreadyFollowing) => {
      if (err) return res.json(err);
      if (alreadyFollowing) {
        return res.status(409).json({
          message: 'User already following other user',
        });
      }
      const follow = new Follow({
        following: id,
        followed: otherid,
      });
      follow.save((err) => {
        if (err) return res.json(err);
        res.status(200).json({
          message: 'follow successful',
        });
      });
    });
};

// user (id) unfollow another user (otherid)
exports.unfollow_post = (req, res, next) => {
  const { user } = req;
  const id = user._id;
  const otherid = mongoose.Types.ObjectId(req.params.otherid);
  Follow.findOneAndRemove({ following: id, followed: otherid })
    .exec((err) => {
      if (err) return res.json(err);
      res.status(200).json({
        message: 'unfollow successful',
      });
    });
};

// delete user
exports.delete_post = (req, res, next) => {
  const { user } = req;
  const id = user._id;

  User.findByIdAndRemove(id, (err) => {
    if (err) return res.json(err);
    res.json('delete successful');
  });
};

exports.logout_post = (req, res, next) => {
  res.json('Not yet implemented');
};
