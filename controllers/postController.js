const { body, validationResult } = require('express-validator');
const s3Upload = require('../aws-image/s3-upload');
const User = require('../models/user');
const Post = require('../models/post');
const Like = require('../models/like');
const s3Remove = require('../aws-image/s3-remove');

// list of posts for home page
exports.home = (req, res, next) => {
  const { user } = req;
  User.findById(user._id)
    .populate('following')
    .exec((err, userInfo) => {
      if (err) return res.json(err);
      const homeIds = userInfo.following.map((f) => f.followed);
      homeIds.push(user._id);
      Post.find({ user: { $in: homeIds } })
        .sort({ date: -1 })
        .limit(20)
        .populate('user')
        .populate('likes')
        .exec((err, posts) => {
          if (err) return res.json(err);
          res.json(posts);
        });
    });
};

// create new post - user from token, caption and image from form
exports.create_post = [
  body('form-caption').trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const firstWord = error.param.split('-')[1];
      const message = `${firstWord.charAt(0).toUpperCase()
        + firstWord.slice(1)} ${error.msg.toLowerCase()}`;
      return res.status(400).json({ message });
    }

    const { user } = req;
    const file = req.files['form-image'][0];

    const caption = req.body['form-caption'];
    const date = Date.now();

    const key = date + file.originalname;
    // const newFile = await s3Upload.sharpify(file, 1040, 1120);
    await s3Upload.upload_image(file, key);

    const post = new Post({
      user, caption, image: key, date,
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
    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      const firstWord = error.param.split('-')[1];
      const message = `${firstWord.charAt(0).toUpperCase()
        + firstWord.slice(1)} ${error.msg.toLowerCase()}`;
      return res.status(400).json({ message });
    }

    const update = { caption: req.body['form-caption'] };
    Post.findByIdAndUpdate(req.params.id, update, {}, (err, updatedPost) => {
      if (err) res.json(err);
      res.json(updatedPost);
    });
  },
];

exports.delete_post = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  await s3Remove.delete_image(post.image);

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
              message: 'Post already liked',
            });
          }
          like.save((err) => {
            if (err) return res.json(err);
            res.json(like);
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
        .exec((err, like) => {
          if (err) return res.json(err);
          res.json(like);
        });
    });
};
