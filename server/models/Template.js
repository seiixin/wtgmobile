const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  templateNumber: { type: Number, required: true, unique: true },
  previewImage: { type: String, required: true }, // Cloudinary URL
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);