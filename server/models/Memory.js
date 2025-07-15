const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  birth: String,
  burial: String,
  template: { 
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    templateNumber: { type: Number, required: true },
    previewImage: { type: String, required: true }
  },
  messages: [String],
  images: [String],
  video: String,
  email: String,
  avatar: String,
  memorialHtml: String, // ✅ Add this field to store generated HTML
  approved: { type: Boolean, default: false }, // ✅ Add this field for approval status
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memory', MemorySchema);