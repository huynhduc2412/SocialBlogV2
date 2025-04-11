const express = require('express');
const router = express.Router();
const perspectiveController = require('../controllers/perspectiveController');
const verifyToken = require('../middleware/verifyToken');

router.post('/analyze', verifyToken, perspectiveController.analyzeComment);

module.exports = router;
