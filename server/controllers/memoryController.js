const Memory = require('../models/Memory');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (set your env variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createMemory = async (req, res) => {
  try {
    const { name, birth, burial, template, messages } = req.body;
    let images = [];
    let video = null;

    // Handle file uploads (multer should provide req.files)
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of imageFiles) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: 'memories/images'
        });
        images.push(upload.secure_url);
      }
    }
    if (req.files && req.files.video) {
      const upload = await cloudinary.uploader.upload(req.files.video[0].path, {
        folder: 'memories/videos',
        resource_type: 'video'
      });
      video = upload.secure_url;
    }

    const memory = new Memory({
      name,
      birth,
      burial,
      template,
      messages,
      images,
      video
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMemory, getMemories };