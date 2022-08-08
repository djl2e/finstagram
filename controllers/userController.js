const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const async = require('async');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

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

// get user info (including user posts)
exports.user = (req, res, next) => {
  async.parallel({
    user(callback) {
      User.findById(req.params.id).exec(callback);
    },
    posts(callback) {
      Post.find({ user: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) return res.json(err);
    const { user, posts } = results;
    if (user === null) {
      return res.status(404).json({
        message: 'User not found',
        user,
      });
    }
    res.status(200).json({ user, posts });
  });
};

// get user info for update form
exports.update_get = (req, res, next) => {
  const { user } = req;
  const {
    name, username, password, description,
  } = user;
  res.json({
    name, username, password, description,
  });
};

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
  const { otherid } = req.params;
  const { user } = req;
  const id = user._id;
  User.findById(otherid, 'followers')
    .exec((err, otherUser) => {
      if (err) return res.json(err);
      const userFollowingFound = user.following;
      const otherFollowersFound = otherUser.followers;
      if (userFollowingFound.indexOf(otherid) !== -1 || otherFollowersFound.indexOf(id) !== -1) {
        return res.status(409).json({
          message: 'User already following other user',
        });
      }
      const userFollowing = userFollowingFound.concat(otherid);
      const otherFollowers = otherFollowersFound.concat(id);
      async.parallel({
        userUpdate(callback) {
          User.findByIdAndUpdate(id, { following: userFollowing }, {}).exec(callback);
        },
        otherupdate(callback) {
          User.findByIdAndUpdate(otherid, { followers: otherFollowers }, {}).exec(callback);
        },
      }, (err, update) => {
        if (err) return res.json(err);
        res.json('followed!');
      });
    });
};

// user (id) unfollow another user (otherid)
exports.unfollow_post = (req, res, next) => {
  const { otherid } = req.params;
  const { user } = req;
  const id = user._id.toString();

  User.findById(otherid, 'followers')
    .exec((err, otherUser) => {
      if (err) return res.json(err);
      const userFollowingFound = user.following;
      const otherFollowersFound = otherUser.followers;
      if (userFollowingFound.indexOf(otherid) === -1 || otherFollowersFound.indexOf(id) === -1) {
        return res.status(409).json({
          message: 'User not following other user',
        });
      }
      const userFollowing = userFollowingFound
        .filter((followingId) => followingId.toString() !== otherid);
      const otherFollowers = otherFollowersFound
        .filter((followerId) => followerId.toString() !== id);
      async.parallel({
        userUpdate(callback) {
          User.findByIdAndUpdate(id, { following: userFollowing }, {}).exec(callback);
        },
        otherupdate(callback) {
          User.findByIdAndUpdate(otherid, { followers: otherFollowers }, {}).exec(callback);
        },
      }, (err, update) => {
        if (err) return res.json(err);
        res.json('unfollowed!');
      });
    });
};

// delete user
exports.delete_post = (req, res, next) => {
  res.json('Not yet implemented');
  // const { user } = req;
  // const id = user._id.toString();
  // const { followers, following } = user;

  // for (let i = 0; i < followers.length; i++) {
  //   const otherId = followers[i]._id.toString();
  //   const otherIdFollowing =
  // }

  // User.findByIdAndRemove(req.user._id, (err) => {
  //   if (err) return res.json(err);
  //   res.json('User delete'); // check if this is the appropriate json to send
  // });
};

exports.logout_post = (req, res, next) => {
  res.json('Not yet implemented');
};
