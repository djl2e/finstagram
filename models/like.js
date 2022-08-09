const mongoose = require('mongoose');

const { Schema } = mongoose;

const LikeSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    likedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
);

module.exports = mongoose.model('Like', LikeSchema);
