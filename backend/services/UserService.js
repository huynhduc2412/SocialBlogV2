const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

exports.register = async ({ name, email, username, password }) => {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new Error('Email hoặc Username đã tồn tại');

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  const newUser = new User({
    name,
    email,
    username,
    password: hashedPassword,
    verificationCode,
    enabled: false,
  });

  await newUser.save();

  await sendVerificationEmail(email, verificationCode);

  return newUser;
};

exports.verifyEmail = async (code) => {
  const decoded = jwt.verify(code, process.env.JWT_SECRET_KEY);
  const user = await User.findOne({ email: decoded.email });

  if (!user || user.enabled) throw new Error('Xác minh thất bại');

  user.enabled = true;
  user.verificationCode = null;
  await user.save();
};

const findByUsername = async (username) => {
  return await User.findOne({ username });
};

const findByIdR = async (id, currentUserId) => {
  const user = await User.findById(id).select('-password'); // Loại bỏ password
  if (!user) {
    throw new Error('User not found');
  }
  const currentUser = await User.findById(currentUserId).populate('following');
  const amIFollowing = currentUser
    ? currentUser.following.some(
        (f) => f.following.toString() === user._id.toString()
      )
    : false;
  return {
    ...user.toObject(),
    amIFollowing,
  };
};

const updateUser = async (id, userRequest) => {
  const { name, email, profilePicture } = userRequest;
  return await User.findByIdAndUpdate(
    id,
    { name, email, profilePicture },
    { new: true }
  );
};

const getTopAuthors = async (currentUserId) => {
  try {
    const result = await Post.aggregate([
      {
        // Bóc tách author.$id từ DBRef
        $project: {
          authorId: '$author',
        },
      },
      {
        $group: {
          _id: '$authorId',
          postCount: { $sum: 1 },
        },
      },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          username: '$user.username',
          postCount: 1,
          profilePicture: '$user.profilePicture',
        },
      },
    ]);

    const currentUser = await User.findById(currentUserId).populate(
      'following'
    );

    return await Promise.all(
      result.map(async (user) => {
        const fullUser = await User.findById(user._id)
          .populate('followers')
          .populate('following');

        const amIFollowing = currentUser
          ? currentUser.following.some(
              (f) => f.following.toString() === user._id.toString()
            )
          : false;

        return {
          postCount: user.postCount,
          id: user._id,
          userDetails: [
            {
              id: user._id,
              username: user.username,
              profilePicture: user.profilePicture,
              followingNumber: fullUser.following.length,
              followerNumber: fullUser.followers.length,
              amIFollowing,
            },
          ],
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  findByUsername,
  findByIdR,
  updateUser,
  getTopAuthors,
};
