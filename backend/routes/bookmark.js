const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const verifyToken = require('../middleware/verifyToken');
// const checkUserEnabled = require('../middleware/checkUserEnabled'); // like your @CheckUserEnabled

router.post(
  '/post/:id',
  verifyToken,
  //   checkUserEnabled,
  bookmarkController.bookmarkPost
);
router.delete(
  '/post/:id',
  verifyToken,
  //   checkUserEnabled,
  bookmarkController.removeBookmark
);
router.get(
  '/',
  verifyToken,
  //   checkUserEnabled,
  bookmarkController.getUserBookmarks
);

module.exports = router;
