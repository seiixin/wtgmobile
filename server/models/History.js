const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grave: { type: Object, required: true }, // Store grave info as an object
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);