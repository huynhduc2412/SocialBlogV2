// models/Like.js
const mongoose = require('mongoose');
const LikeType = require('./enums/LikeType'); // Import enum LikeType

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Liên kết tới User model
    required: true
  },

  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type',  // refPath cho phép dùng cùng một trường liên kết tới cả Post và Comment
    required: true
  },

  type: {
    type: String,
    enum: Object.values(LikeType),  // Sử dụng enum LikeType
    required: true
  },

  likedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Like', LikeSchema);
