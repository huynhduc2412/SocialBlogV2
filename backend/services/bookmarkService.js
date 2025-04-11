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
  // Step 1: Get all bookmarked post IDs
  const bookmarks = await Bookmark.find({ userId }).lean();
  const postIds = bookmarks.map((b) => b.postId);

  // Step 2: Fetch all bookmarked posts at once
  const posts = await Post.find({ _id: { $in: postIds } })
    .populate('author', 'name profilePicture') // optional
    .lean();

  // Step 3: Get all likes and saves for these posts by this user
  const [likes, savedSet] = await Promise.all([
    Like.find({
      userId,
      contentId: { $in: postIds },
      type: 'POST',
    }).lean(),
    Bookmark.find({
      userId,
      postId: { $in: postIds },
    }).lean(),
  ]);

  const likedIds = new Set(likes.map((l) => l.contentId.toString()));
  const savedIds = new Set(savedSet.map((s) => s.postId.toString()));

  // Step 4: Format result
  const results = posts.map((post) => ({
    _id: post._id,
    title: post.title,
    content: post.content,
    imageCloudUrl: post.imageCloudUrl,
    author: post.author, // already populated
    createdAt: post.createdAt,
    likeCnt: post.likes?.length || 0,
    liked: likedIds.has(post._id.toString()),
    saved: savedIds.has(post._id.toString()),
  }));

  return results;
};

module.exports = {
  bookmarkPost,
  removeBookmark,
  getUserBookmarks,
};
