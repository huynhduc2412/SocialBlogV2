const express = require('express');
const router = express.Router();
const VerifyController = require('../controllers/verifyController');

router.get('/:code', VerifyController.verify);

module.exports = router;
