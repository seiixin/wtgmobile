const Template = require('../models/Template');
const cloudinary = require('cloudinary').v2;

// Get all templates
const getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true }).sort({ templateNumber: 1 });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload new template
const createTemplate = async (req, res) => {
  try {
    const { templateNumber } = req.body;
    let previewImage = req.body.previewImage;

    // If using multer for file upload
    if (req.file && req.file.path) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'templates'
      });
      previewImage = result.secure_url;
    }

    if (!templateNumber || !previewImage) {
      return res.status(400).json({ error: 'Template number and image are required.' });
    }

    // Check for duplicate template number
    const exists = await Template.findOne({ templateNumber });
    if (exists) {
      return res.status(400).json({ error: 'Template number already exists.' });
    }

    const template = new Template({ templateNumber, previewImage });
    await template.save();
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove template
const removeTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!template) return res.status(404).json({ error: 'Template not found.' });
    res.json({ message: 'Template removed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTemplates, createTemplate, removeTemplate };