// routes/followRoutes.js
const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const  verifyToken  = require('../middleware/verifyToken');

// /api/follows

// Follow a user
router.post('/:id', verifyToken, followController.followUser); // solved

// Unfollow a user
router.delete('/:id', verifyToken, followController.unfollowUser); // solved

// Get my followers
router.get('/my-followers', verifyToken, followController.getMyFollowers); //solved

// Get my following
router.get('/my-following', verifyToken, followController.getMyFollowing); //solved

// Get followers of a user
router.get('/:id/followers', followController.getFollowers);//solved

// Get following of a user
router.get('/:id/following', followController.getFollowing);//solved

module.exports = router;
