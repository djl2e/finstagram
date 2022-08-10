const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.create_post = [
  body('form-comment').trim().escape(),
  (req, res, next) => {
    console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array });

    const { user } = req;
    const content = req.body['form-comment'];
    const date = Date.now();

    Post.findById(req.params.post_id, (err, post) => {
      if (err) return res.json(err);
      if (post === null) {
        return res.status(404).json({
          message: 'Post not found',
          post,
        });
      }
      const comment = new Comment({
        user, post, content, date,
      });
      comment.save((err, newComment) => {
        if (err) return res.json(err);
        res.json(newComment._id);
      });
    });
  },
];

exports.update_post = (req, res, next) => {
  res.send('update comment');
};

exports.delete_post = (req, res, next) => {
  res.send('delete comment');
};
