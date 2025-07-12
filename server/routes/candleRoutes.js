const express = require('express');
const router = express.Router();
const candleController = require('../controllers/candleController');
const graveController = require('../controllers/graveController');

// Light a candle (POST)
router.post('/light', candleController.lightCandle);

// Get all candles for a grave (GET)
router.get('/grave/:graveId', candleController.getCandlesForGrave);

// Get candle count for a grave (GET) - e.g. /api/graves/candle-count/:graveType/:graveId
router.get('/candle-count/:graveType/:graveId', graveController.getCandleCount);

module.exports = router;