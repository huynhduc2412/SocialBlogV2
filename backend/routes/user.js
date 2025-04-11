const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyToken = require('../middleware/verifyToken');

router.get('/me', verifyToken, UserController.getAuthenticatedUser);
router.get('/most-posts', verifyToken, UserController.getTopAuthors);
router.get('/:id', verifyToken, UserController.getUserById);
router.put('/', verifyToken, UserController.updateUser);

module.exports = router;
