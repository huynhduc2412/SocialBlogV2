// models/User.js
const mongoose = require('mongoose');
const UserRole = require('./enums/UserRole');

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    profilePicture: String,
    verificationCode: String,
    enabled: { type: Boolean, default: false },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],

    userRole: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
