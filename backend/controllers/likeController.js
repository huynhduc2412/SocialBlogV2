const LikeService = require('../services/likeService');

const likePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    await LikeService.likePost(postId, req.user.userId); // Truyền userId từ token
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error liking post.' });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    await LikeService.unlikePost(postId, req.user.userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error unliking post.' });
  }
};

const likeComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    await LikeService.likeComment(commentId, req.user.userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error liking comment.' });
  }
};

const unlikeComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    await LikeService.unlikeComment(commentId, req.user.userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error unliking comment.' });
  }
};

module.exports = { likePost, unlikePost, likeComment, unlikeComment };
