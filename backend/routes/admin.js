const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin'); // Middleware to check admin access

// Route to get all users (admin-only access)
router.get('/users', verifyToken, isAdmin, AdminController.getUsers);

module.exports = router;
