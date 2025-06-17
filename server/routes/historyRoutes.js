const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/add', historyController.addHistory); // Add to history
router.get('/:userId', historyController.getHistory); // Get history
router.delete('/:userId', historyController.clearHistory); // Clear history

module.exports = router;