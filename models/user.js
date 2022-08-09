const mongoose = require('mongoose');
const Follow = require('./follow');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    description: { type: String },
  },
);

UserSchema
  .pre('findOneAndRemove', function (next) {
    const id = this._conditions._id;
    Follow.deleteMany({ $or: [{ following: id }, { followed: id }] })
      .then(next());
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
