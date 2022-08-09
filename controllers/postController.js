const { body, validationResult } = require('express-validator');
const async = require('async');
const upload = require('../multer-file');
const User = require('../models/user');
const Post = require('../models/post');

// create new post - user from token, caption and image from form
exports.create_post = [
  upload.single('form-image'),
  body('form-caption').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array });

    const { user } = req;
    const caption = req.body['form-caption'];
    const image = req.file.key;
    const date = Date.now();

    const post = new Post({
      user, caption, image, date,
    });

    post.save((err, newPost) => {
      if (err) res.json(err);
      res.json(newPost._id);
    });
  },
];

// update caption
exports.update_post = [
  body('form-caption').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array });

    const update = { caption: req.body['form-caption'] };
    console.log(update);
    Post.findByIdAndUpdate(req.params.id, update, {}, (err, updatedPost) => {
      if (err) res.json(err);
      res.json(updatedPost._id);
    });
  },
];

exports.delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.params.id, (err) => {
    if (err) return res.json(err);
    res.json('post deleted');
  });
};

exports.post_get = (req, res, next) => {
  res.send('individual post page');
};

exports.like = (req, res, next) => {
  res.send('not implemented');
};

exports.dislike = (req, res, next) => {
  res.send('not implemented');
};
