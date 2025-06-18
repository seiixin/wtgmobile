const mongoose = require('mongoose');

const candleSchema = new mongoose.Schema({
  graveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grave', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String }, // optional
  litAt: { type: Date, default: Date.now }
});

candleSchema.index({ graveId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Candle', candleSchema);