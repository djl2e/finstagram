const Comment = require('../models/comment');

exports.create_comment_post = (req, res, next) => {
  res.send('new comment');
};

exports.delete_comment_post = (req, res, next) => {
  res.send('delete comment');
};
