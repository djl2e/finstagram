const { body, validationResult } = require('express-validator');
const upload = require('../multer-file');
const Post = require('../models/post');
const Like = require('../models/like');

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
  Post.findById(req.params.id)
    .populate('user')
    .populate('comments')
    .populate('likes')
    .exec((err, post) => {
      if (err) return res.json(err);
      if (post === null) {
        return res.status(404).json({
          message: 'Post not found',
          post,
        });
      }
      res.json({
        post,
        comments: post.comments,
        likes: post.likes,
      });
    });
};

exports.like = (req, res, next) => {
  Post.findById(req.params.id)
    .exec((err, post) => {
      if (err) return res.json(err);
      if (post === null) {
        return res.status(404).json({
          message: 'Post not found',
          post,
        });
      }

      const like = new Like({
        post,
        likedBy: req.user,
      });

      Like.findOne({ post, likedBy: req.user })
        .exec((err, exists) => {
          if (err) return res.json(err);
          if (exists) {
            return res.status(409).json({
              error: 'Post already liked',
            });
          }
          like.save((err) => {
            if (err) return res.json(err);
            res.json('Post liked');
          });
        });
    });
};

exports.unlike = (req, res, next) => {
  Post.findById(req.params.id)
    .exec((err, post) => {
      if (err) return res.json(err);
      if (post === null) {
        return res.status(404).json({
          message: 'Post not found',
          post,
        });
      }
      Like.findOneAndRemove({ post: post._id, likedBy: req.user._id })
        .exec((err) => {
          if (err) return res.json(err);
          res.json('Post unliked');
        });
    });
};
