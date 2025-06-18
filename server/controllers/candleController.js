const Candle = require('../models/candle');
const mongoose = require('mongoose');

exports.lightCandle = async (req, res) => {
  try {
    let { graveId, userId, userName, userAvatar } = req.body;
    if (!graveId || !userId || !userName) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Convert to ObjectId
    graveId = mongoose.Types.ObjectId(graveId);
    userId = mongoose.Types.ObjectId(userId);

    // Check if user has lit a candle for this grave in the last 24 hours
    const lastCandle = await Candle.findOne({ graveId, userId }).sort({ litAt: -1 });
    if (lastCandle && (Date.now() - new Date(lastCandle.litAt).getTime()) < 24 * 60 * 60 * 1000) {
      return res.status(403).json({ error: 'You can only light a candle once every 24 hours.' });
    }

    // Create or update the candle
    await Candle.findOneAndUpdate(
      { graveId, userId },
      { $set: { litAt: new Date(), userName, userAvatar } },
      { upsert: true, new: true }
    );

    // Return updated candle list
    const candles = await Candle.find({ graveId }).sort({ litAt: -1 });
    res.json({ success: true, candles });
  } catch (err) {
    console.error('Light candle error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getCandlesForGrave = async (req, res) => {
  try {
    const { graveId } = req.params;
    const candles = await Candle.find({ graveId }).sort({ litAt: -1 });
    res.json({ candles });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};