// models/Bookmark.js
const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model User
      required: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Liên kết với model Post
      required: true,
    },

    bookmarkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bookmark', BookmarkSchema);
