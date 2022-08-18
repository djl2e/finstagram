const mongoose = require('mongoose');
const Comment = require('./comment');
const Like = require('./like');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    image: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    toJSON: { virtuals: true },
  },
);

PostSchema
  .pre('findOneAndRemove', function (next) {
    const id = this._conditions._id;
    Promise.all([
      Comment.deleteMany({ post: id }),
      Like.deleteMany({ post: id }),
    ]).then(next());
  });

PostSchema
  .virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
  });

PostSchema
  .virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
  });

PostSchema
  .virtual('url')
  .get(function () {
    return `post/${this._id}`;
  });

module.exports = mongoose.model('Post', PostSchema);
