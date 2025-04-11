const commentService = require('../services/commentService');

// Get comments for a specific post
const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.userId || null;

    const comments = await commentService.getCommentsByPost(postId, userId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Create a comment on a specific post
const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    const { content } = req.body;

    console.log(postId + ' ' + userId + ' ' + content);

    const newComment = await commentService.createComment(
      content,
      postId,
      userId
    );
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create comment' + err });
  }
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    await commentService.deleteCommentR(commentId);
    res.sendStatus(204);
  } catch (err) {
    res.status(404).json({ message: 'Comment not found or delete failed' });
  }
};

module.exports = {
  getCommentsByPost,
  createComment,
  deleteComment,
};
