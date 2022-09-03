const mongoose = require('mongoose');
const Post = require('./post');
const Comment = require('./comment');
const Follow = require('./follow');
const Like = require('./like');
const s3Remove = require('../aws-image/s3-remove');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    description: { type: String },
    image: { type: String },
  },
);

UserSchema
  .pre('findOneAndRemove', async function (next) {
    const id = this._conditions._id;
    const posts = await Post.find({ user: id });

    Promise.all(
      posts.map((post) => s3Remove.delete_image(post.image)),
    );

    Promise.all([
      Post.deleteMany({ user: id }),
      Comment.deleteMany({ $or: [{ user: id }, { post: { $in: posts } }] }),
      Follow.deleteMany({ $or: [{ following: id }, { followed: id }] }),
      Like.deleteMany({ $or: [{ likedBy: id }, { post: { $in: posts } }] }),
    ]).then(next());
  });

UserSchema
  .virtual('followers', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'followed',
  });

UserSchema
  .virtual('following', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'following',
  });

UserSchema
  .virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user',
  });

UserSchema
  .virtual('url')
  .get(function () {
    return `user/${this._id}`;
  });

module.exports = mongoose.model('User', UserSchema);
