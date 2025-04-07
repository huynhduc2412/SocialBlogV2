// models/Interaction.js
const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Liên kết với model User
    required: true
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',  // Liên kết với model Post
    required: true
  },

  type: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Interaction', InteractionSchema);
