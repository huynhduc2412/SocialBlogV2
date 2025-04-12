const Follow = require('../models/Follow');
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = {
  // Follow a user
  async followUser(currentUserId, targetUserId) {
    try {
      if (currentUserId === targetUserId) {
        throw new Error("You can't follow yourself");
      }

      const existingFollow = await Follow.findOne({
        follower: currentUserId,
        following: targetUserId,
      });
      if (existingFollow) {
        throw new Error('You are already following this user');
      }

      const follow = new Follow({
        follower: currentUserId,
        following: targetUserId,
        followedAt: Date.now(),
      });

      await follow.save();

      await User.updateOne(
        { _id: currentUserId },
        { $push: { following: follow._id } }
      );

      await User.updateOne(
        { _id: targetUserId },
        { $push: { followers: follow._id } }
      );

      return follow;
    } catch (err) {
      throw err;
    }
  },

  // Unfollow a user
  async unfollowUser(currentUserId, targetUserId) {
    try {
      const follow = await Follow.findOneAndDelete({
        follower: currentUserId,
        following: targetUserId,
      });
      if (!follow) {
        throw new Error('Follow relationship does not exist');
      }

      await User.updateOne(
        { _id: currentUserId },
        { $pull: { following: follow._id } }
      );

      await User.updateOne(
        { _id: targetUserId },
        { $pull: { followers: follow._id } }
      );

      return follow;
    } catch (err) {
      throw err;
    }
  },

  // Get followers
  async getFollowers(userId) {
    try {
      const user = await User.findById(userId).populate('followers');
      var users = [];

      for (let follower of user.followers) {
        let userDetails = await User.findById(
          follower.follower.toString()
        ).select('_id name profilePicture');
        users.push(userDetails);
      }
      console.log(users);
      return users;
    } catch (err) {
      throw err;
    }
  },

  // Get following
  async getFollowing(userId) {
    try {
      const user = await User.findById(userId).populate('following');
      var users = [];

      for (const fol of user.following) {
        const userDetails = await User.findById(
          fol.following.toString()
        ).select('_id name profilePicture');
        users.push(userDetails);
      }
      console.log(users);
      return users;
    } catch (err) {
      throw err;
    }
  },

  // Get my followers (current logged-in user)
  async getMyFollowers(currentUserId) {
    try {
      const user = await User.findById(currentUserId).populate('followers');
      return user.followers;
    } catch (err) {
      throw err;
    }
  },

  // Get my following (current logged-in user)
  async getMyFollowing(currentUserId) {
    try {
      const user = await User.findById(currentUserId).populate('following');
      return user.following;
    } catch (err) {
      throw err;
    }
  },
};
