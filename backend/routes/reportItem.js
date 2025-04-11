const express = require('express');
const router = express.Router();
const reportItemController = require('../controllers/reportItemController');
const verifyToken = require('../middleware/verifyToken'); // Optional: Add authentication middleware

// Routes for report items
router.get('/', verifyToken, reportItemController.getAllReportItems);
router.get('/:id', verifyToken, reportItemController.getReportItemById);
router.post('/', verifyToken, reportItemController.createReportItem);
router.put('/:id', verifyToken, reportItemController.updateReportItem);
router.delete('/:id', verifyToken, reportItemController.deleteReportItem);

module.exports = router;
