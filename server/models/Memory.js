const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  birth: String,
  burial: String,
  template: { type: Number, required: true },
  messages: [String],
  images: [String], // Cloudinary URLs
  video: String,    // Cloudinary URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memory', MemorySchema);