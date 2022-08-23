const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Follow = require('../models/follow');
const s3Image = require('../aws-image/s3-image');
const upload = require('../aws-image/multer-file');

dotenv.config();

// search for another user
// username that starts with keyword gets precedence
// next is username that contains the keyword
exports.search = (req, res, next) => {
  const { search } = req.query;
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
      const blacklist = initialSearch.map((user) => user._id.toString());
      User.find({ username: new RegExp(`.+${search}`, 'i'), _id: { $nin: blacklist } })
        .sort({ username: 1 })
        .limit(remainingLength)
        .exec((err, remainingSearch) => {
          if (err) res.json(err);
          const finalSearch = initialSearch.concat(...remainingSearch)
            .filter((user) => user.username !== username);
          res.json(finalSearch);
        });
    });
};

// suggest users to follow
exports.suggested = (req, res, next) => {
  User.findById(req.user._id)
    .populate('following')
    .exec((err, result) => {
      if (err) return res.json(err);
      const blacklist = result.following.map((follow) => follow.followed);
      blacklist.push(req.user._id);
      User.aggregate([{ $match: { _id: { $nin: blacklist } } }, { $sample: { size: 5 } }])
        .exec((err, suggested) => {
          if (err) res.json(err);
          res.json(suggested);
        });
    });
};

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

// get mini user info (NOT including user following, followers, post)
exports.mini_user = (req, res, next) => {
  User.findById(req.params.id)
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
      });
    });
};

// get current user id
exports.profile = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// post (submit) form for updating user info
exports.update_post = [
  body('form-name').trim().isLength({ min: 1 }).escape(),
  body('form-description').trim().escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const firstWord = error.param.split('-')[1];
      const message = `${firstWord.charAt(0).toUpperCase()
        + firstWord.slice(1)} ${error.msg.toLowerCase()}`;
      return res.status(400).json({ message });
    }

    const name = req.body['form-name'];
    const description = req.body['form-description'];

    const { user } = req;

    const updatedUserInfo = {
      name,
      description,
    };

    User.findByIdAndUpdate(user._id, updatedUserInfo, {}, (err, updatedUser) => {
      if (err) return res.json(err);
      res.json('User info updated'); // check if this is the appropriate json to send
    });
  },
];

exports.password_post = [
  body('form-password', 'Minimum password length is 6').trim().isLength({ min: 6 }).escape(),
  body('form-confirm').trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const firstWord = error.param.split('-')[1];
      const message = `${firstWord.charAt(0).toUpperCase()
        + firstWord.slice(1)} ${error.msg.toLowerCase()}`;
      return res.status(400).json({ message });
    }

    const password = req.body['form-password'];
    const confirm = req.body['form-confirm'];
    if (password !== confirm) {
      return res.status(401).json({
        message: 'Password confirmation different from password',
      });
    }

    const { user } = req;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) res.json(err);
      const updatedUserInfo = {
        password: hash,
      };

      User.findByIdAndUpdate(user._id, updatedUserInfo, {}, (err, updatedUser) => {
        if (err) return res.json(err);
        res.json('User info updated'); // check if this is the appropriate json to send
      });
    });
  },
];

exports.image_post = [
  upload.single('form-user-image'),
  async (req, res, next) => {
    const { user } = req;

    if (user.image !== 'blank.png') {
      await s3Image.delete_image(user.image);
    }

    let image = 'blank.png';
    if (req.file) {
      image = req.file.key;
    }

    User.findByIdAndUpdate(user._id, { image }, {}, (err, updatedUser) => {
      if (err) return res.json(err);
      res.json('User image updated');
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
      follow.save((err, success) => {
        if (err) return res.json(err);
        res.json(success);
      });
    });
};

// user (id) unfollow another user (otherid)
exports.unfollow_post = (req, res, next) => {
  const { user } = req;
  const id = user._id;
  const otherid = mongoose.Types.ObjectId(req.params.otherid);
  Follow.findOneAndRemove({ following: id, followed: otherid })
    .exec((err, success) => {
      if (err) return res.json(err);
      res.json(success);
    });
};

// delete user
exports.delete_post = async (req, res, next) => {
  const { user } = req;
  const id = user._id;
  const { image } = user;

  if (image !== 'blank.png') {
    await s3Image.delete_image(image);
  }

  User.findByIdAndRemove(id, (err) => {
    if (err) return res.json(err);
    res.json('delete successful');
  });
};

exports.logout_post = (req, res, next) => {
  res.json('Not yet implemented');
};
