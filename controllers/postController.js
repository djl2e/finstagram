const User = require('../models/user');
const Post = require('../models/post');

exports.create_get = (req, res, next) => {
  res.send('get form for creating new post');
};

exports.create_post = (req, res, next) => {
  res.send('submit form for creating new post');
};

exports.update_get = (req, res, next) => {
  res.send('get form for updating post');
};

exports.update_post = (req, res, next) => {
  res.send('submit form for updating post');
};

exports.delete_get = (req, res, next) => {
  res.send('get form for deleting post');
};

exports.delete_post = (req, res, next) => {
  res.send('submit form for deleting post');
};

exports.detail = (req, res, next) => {
  res.send('individual post page');
};
