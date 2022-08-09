const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
});

CommentSchema
  .virtual('url')
  .get(function () {
    return `comment/${this._id}`;
  });

module.exports = mongoose.model('Comment', CommentSchema);
