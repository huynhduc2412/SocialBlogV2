// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  
  category: {
    type: String,
    required: true
  },

  tags: [{
    type: String
  }],

  content: {
    type: String,
    required: true
  },

  imageCloudUrl: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Liên kết với model User
    required: true
  },

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'  // Liên kết với model Comment
  }],

  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Like'  // Liên kết với model Like
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
