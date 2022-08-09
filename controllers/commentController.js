const Comment = require('../models/comment');

exports.create_post = (req, res, next) => {
  res.send('new comment');
};

exports.update_post = (req, res, next) => {
  res.send('update comment');
};

exports.delete_post = (req, res, next) => {
  res.send('delete comment');
};
