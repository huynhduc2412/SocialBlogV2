const bookmarkService = require('../services/bookmarkService');

// Bookmark a post
const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    await bookmarkService.bookmarkPost(postId, userId);
    res.sendStatus(204);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to bookmark post', error: err.message });
  }
};

// Remove a bookmark
const removeBookmark = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    await bookmarkService.removeBookmark(postId, userId);
    res.sendStatus(204);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to remove bookmark', error: err.message });
  }
};

// Get all bookmarks for the logged-in user
const getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    res.status(200).json(bookmarks);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch bookmarks', error: err.message });
  }
};

module.exports = {
  bookmarkPost,
  removeBookmark,
  getUserBookmarks,
};
