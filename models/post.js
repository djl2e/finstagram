const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String },
    image: { type: String, required: true },
    date: { type: Date, required: true },
  },
);

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
