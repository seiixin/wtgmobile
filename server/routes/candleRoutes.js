const express = require('express');
const router = express.Router();
const candleController = require('../controllers/candleController');

// Light a candle (POST)
router.post('/light', candleController.lightCandle);

// Get all candles for a grave (GET)
router.get('/grave/:graveId', candleController.getCandlesForGrave);

module.exports = router;