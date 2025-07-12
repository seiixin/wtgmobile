const Candle = require('../models/candle');
const mongoose = require('mongoose');
const AdultGrave = require('../models/AdultGrave');
const ChildGrave = require('../models/ChildGrave');
const BoneGrave = require('../models/BoneGrave');

function getGraveModel(graveType) {
  if (graveType === 'adult') return AdultGrave;
  if (graveType === 'child') return ChildGrave;
  if (graveType === 'bone') return BoneGrave;
  throw new Error('Invalid grave type');
}

exports.lightCandle = async (req, res) => {
  try {
    let { graveId, graveType, userId, userName, userAvatar } = req.body;
    if (!graveId || !graveType || !userId || !userName) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // ✅ Use 'new' keyword here!
    graveId = new mongoose.Types.ObjectId(graveId);
    userId = new mongoose.Types.ObjectId(userId);

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

    // Increment CandleCount in the correct grave model
    const GraveModel = getGraveModel(graveType);
    await GraveModel.findByIdAndUpdate(graveId, { $inc: { CandleCount: 1 } });

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