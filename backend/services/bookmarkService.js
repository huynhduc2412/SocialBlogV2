const Bookmark = require('../models/Bookmark');
const Post = require('../models/Post');
const Like = require('../models/Like');
const User = require('../models/User');
const userService = require('./UserService');

// Bookmark a post
const bookmarkPost = async (postId, userId) => {
  const exists = await Bookmark.exists({ userId, postId });

  if (!exists) {
    const newBookmark = new Bookmark({
      userId,
      postId,
      createdAt: new Date(),
    });
    await newBookmark.save();
  }
};

// Remove a bookmark
const removeBookmark = async (postId, userId) => {
  await Bookmark.deleteOne({ userId, postId });
};

// Get all bookmarks for a user
const getUserBookmarks = async (userId) => {
  const bookmarks = await Bookmark.find({ userId });

  const posts = [];

  for (const bookmark of bookmarks) {
    const post = await Post.findById(bookmark.postId);
    if (post) posts.push(post);
  }

  const results = await Promise.all(
    posts.map(async (post) => {
      const liked = await Like.exists({
        userId,
        contentId: post._id,
        type: 'POST',
      });

      const saved = await Bookmark.exists({
        userId,
        postId: post._id,
      });

      return {
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.user, // or format user info if needed
        createdAt: post.createdAt,
        likeCnt: post.likes.length,
        liked,
        saved,
      };
    })
  );

  return results;
};

module.exports = {
  bookmarkPost,
  removeBookmark,
  getUserBookmarks,
};
