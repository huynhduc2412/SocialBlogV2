const express = require('express');
const router = express.Router();
const perspectiveController = require('../controllers/perspectiveController');

router.post('/ananlyze', perspectiveController.analyzeComment);

module.exports = router;
