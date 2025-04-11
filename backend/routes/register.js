const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /register
router.post('/', authController.register);

module.exports = router;
