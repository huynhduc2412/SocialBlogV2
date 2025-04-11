// controllers/followController.js
const followService = require('../services/followService');

module.exports = {
  async followUser(req, res) {
    try {
      const currentUserId = req.user.userId;
      const targetUserId = req.params.id;

      const follow = await followService.followUser(currentUserId, targetUserId);
      res.status(200).json({ message: 'You are now following the user', follow });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async unfollowUser(req, res) {
    try {
      const currentUserId = req.user.userId;
      const targetUserId = req.params.id;

      const unfollow = await followService.unfollowUser(currentUserId, targetUserId);
      res.status(200).json({ message: 'You have unfollowed the user', unfollow });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getMyFollowers(req, res) {
    try {
      const currentUserId = req.user.userId;
      const followers = await followService.getMyFollowers(currentUserId);
      res.status(200).json(followers);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getMyFollowing(req, res) {
    try {
      const currentUserId = req.user.userId;
      const following = await followService.getMyFollowing(currentUserId);
      res.status(200).json(following);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getFollowers(req, res) {
    try {
      const userId = req.params.id;
      const followers = await followService.getFollowers(userId);
      res.status(200).json(followers);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getFollowing(req, res) {
    try {
      const userId = req.params.id;
      const following = await followService.getFollowing(userId);
      res.status(200).json(following);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
