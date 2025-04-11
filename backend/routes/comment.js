const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verifyToken = require('../middleware/verifyToken');
// const checkUserEnabled = require("../middleware/checkUserEnabled");

router.get('/:id', commentController.getCommentsByPost);
router.post(
  '/:id',
  verifyToken,
  //   checkUserEnabled,
  commentController.createComment
);
router.delete(
  '/:id',
  verifyToken,
  //   checkUserEnabled,
  commentController.deleteComment
);

module.exports = router;
