const mongoose = require('mongoose');

const { Schema } = mongoose;

const FollowSchema = new Schema(
  {
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followed: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
);

module.exports = mongoose.model('Follow', FollowSchema);
