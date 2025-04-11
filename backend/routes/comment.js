const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');
const verifyToken = require('../middleware/verifyToken');
// const checkUserEnabled = require("../middleware/checkUserEnabled");

router.get('/:id', CommentController.getCommentsByPost);
router.post(
  '/:id',
  verifyToken,
  //   checkUserEnabled,
  CommentController.createComment
);
router.delete(
  '/:id',
  verifyToken,
  //   checkUserEnabled,
  CommentController.deleteComment
);

module.exports = router;
