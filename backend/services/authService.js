const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  const token = jwt.sign(
    { userId: user._id, role: user.userRole },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1d' }
  );

  return {
    token,
    username: user.username,
    profilePicture: user.profilePicture || "",
    id: user._id,
    userRole: user.userRole
  };
};

module.exports = { loginUser };
