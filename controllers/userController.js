const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const async = require('async');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

dotenv.config();

// new user signup
exports.signup_post = [
  body('form-name').trim().isLength({ min: 1 }).escape(),
  body('form-username').trim().isLength({ min: 1 }).escape(),
  body('form-password', 'Minimum password length is 6').trim().isLength({ min: 6 }).escape(),
  body('form-confirm').trim().escape(),
  body('form-description').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.json({ errors: errors.array() });

    const name = req.body['form-name'];
    const username = req.body['form-username'];
    const password = req.body['form-password'];
    const confirm = req.body['form-confirm'];
    const description = req.body['form-description'];

    if (password !== confirm) {
      return res.status(401).json({
        error: 'Password confirmation different from password',
      });
    }

    // hash password and save user if not exists
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return next(err);

      User.findOne({ username })
        .exec((err, result) => {
          if (err) return next(err);
          if (result) {
            return res.status(409).json({
              error: 'Username already exists',
            });
          }
          const user = new User({
            name,
            username,
            password: hash,
            description,
            followers: [],
            following: [],
          });
          user.save((err) => {
            if (err) return next(err);
            res.status(200).json({
              message: `Signup successful! Welcome ${username}`,
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
      return res.status(401).json({
        message: 'Incorrect username or password',
        user,
      });
    }

    // jwt token to remember user login status
    jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
      if (err) return res.status(400).json(err);
      res.status(200).json({
        user: {
          _id: user._id,
          username: user.username,
        },
        token,
      });
    });
  })(req, res, next);
};

// search for another user
// username that starts with keyword gets precedence
// next is username that contains the keyword
exports.search = [
  body('search').trim().escape(),

  (req, res, next) => {
    const { search } = req.body;
    User.find({ username: new RegExp(`^${search}`, 'i') })
      .sort({ username: 1 })
      .limit(20)
      .exec((err, initialSearch) => {
        if (err) next(err);
        if (initialSearch.length === 20) {
          res.json(initialSearch);
        }
        const remainingLength = 20 - initialSearch.length;
        User.find({ username: new RegExp(`.+${search}`, 'i') })
          .sort({ username: 1 })
          .limit(remainingLength)
          .exec((err, remainingSearch) => {
            if (err) next(err);
            const finalSearch = initialSearch.concat(...remainingSearch);
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
    if (err) return next(err);
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
  User.findById(req.params.id, 'name username password description')
    .exec((err, user) => {
      if (err) return next(err);
      res.json(user);
    });
};

// user (id) follow another user (otherid)
exports.follow_post = (req, res, next) => {
  const { id, otherid } = req.params;
  async.parallel({
    userFollowing(callback) {
      User.findById(id, 'following').exec(callback);
    },
    otherFollowers(callback) {
      User.findById(otherid, 'followers').exec(callback);
    },
  }, (err, results) => {
    if (err) return next(err);
    const userFollowingFound = results.userFollowing.following;
    const otherFollowersFound = results.otherFollowers.followers;
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
      if (err) return next(err);
      res.json('followed!');
    });
  });
};

// user (id) unfollow another user (otherid)
exports.unfollow_post = (req, res, next) => {
  const { id, otherid } = req.params;
  async.parallel({
    userFollowing(callback) {
      User.findById(id, 'following').exec(callback);
    },
    otherFollowers(callback) {
      User.findById(otherid, 'followers').exec(callback);
    },
  }, (err, results) => {
    if (err) return next(err);
    const userFollowingFound = results.userFollowing.following;
    const otherFollowersFound = results.otherFollowers.followers;
    if (userFollowingFound.indexOf(otherid) === -1 || otherFollowersFound.indexOf(id) === -1) {
      return res.status(409).json({
        message: 'User not following other user',
      });
    }
    const userFollowing = userFollowingFound.filter((followingId) => followingId.toString() !== otherid);
    const otherFollowers = otherFollowersFound.filter((followerId) => followerId.toString() !== id);
    async.parallel({
      userUpdate(callback) {
        User.findByIdAndUpdate(id, { following: userFollowing }, {}).exec(callback);
      },
      otherupdate(callback) {
        User.findByIdAndUpdate(otherid, { followers: otherFollowers }, {}).exec(callback);
      },
    }, (err, update) => {
      if (err) return next(err);
      res.json('unfollowed!');
    });
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

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) next(err);
      const user = {
        name,
        password: hash,
        description,
      };

      User.findByIdAndUpdate(req.params.id, user, {}, (err, updatedUser) => {
        if (err) return next(err);
        res.json('User info updated'); // check if this is the appropriate json to send
      });
    });
  },
];

// delete user
exports.delete_post = (req, res, next) => {
  User.findByIdAndRemove(req.params.id, (err) => {
    if (err) return next(err);
    res.json('User delete'); // check if this is the appropriate json to send
  });
};

exports.logout_post = (req, res, next) => {
  res.json('Not yet implemented');
};
