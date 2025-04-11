const express = require('express');
const router = express.Router();
const { likePost, unlikePost, likeComment, unlikeComment } = require('../controllers/likeController');
const  verifyToken  = require('../middleware/verifyToken'); // Middleware để kiểm tra tài khoản đã được kích hoạt

//api/likes

// Like a post
router.post('/post/:id', verifyToken, likePost); //solved

// Unlike a post
router.delete('/post/:id',verifyToken , unlikePost); // solved

// Like a comment
router.post('/comment/:id',verifyToken ,likeComment); // solved

// Unlike a comment
router.delete('/comment/:id',verifyToken ,unlikeComment); // solved

module.exports = router;
