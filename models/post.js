const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    caption: { type: String },
    image: { type: String, required: true },
    date: { type: Date, required: true },
    liked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
);

PostSchema
  .virtual('url')
  .get(function () {
    return `post/${this._id}`;
  });

module.exports = mongoose.model('Post', PostSchema);
