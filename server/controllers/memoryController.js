const Memory = require('../models/Memory');
const Template = require('../models/Template');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (set your env variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createMemory = async (req, res) => {
  try {
    const { name, birth, burial, template: templateId, email, avatar } = req.body;
    
    console.log('Received data:', { name, birth, burial, templateId, email, avatar });
    console.log('All req.body keys:', Object.keys(req.body)); // Debug: See all keys
    console.log('Raw req.body:', req.body); // ✅ Add this to see the actual data structure
    console.log('Files:', req.files);

    // ✅ FIXED: Proper message parsing for FormData format
    const messages = [];
    
    // Method 1: Parse messages[0], messages[1], etc. format
    let messageIndex = 0;
    while (req.body[`messages[${messageIndex}]`] !== undefined) {
      const message = req.body[`messages[${messageIndex}]`];
      console.log(`Found message[${messageIndex}]:`, message); // Debug log
      
      if (message && typeof message === 'string' && message.trim()) {
        messages.push(message.trim());
      }
      messageIndex++;
    }
    
    // Method 2: Alternative parsing - check all keys that start with 'messages['
    if (messages.length === 0) {
      console.log('Method 1 failed, trying Method 2...');
      const messageKeys = Object.keys(req.body).filter(key => key.startsWith('messages['));
      console.log('Found message keys:', messageKeys);
      
      messageKeys.forEach(key => {
        const message = req.body[key];
        if (message && typeof message === 'string' && message.trim()) {
          messages.push(message.trim());
        }
      });
    }

    // Method 3: Check if messages is sent as a JSON string or array
    if (messages.length === 0 && req.body.messages) {
      console.log('Method 2 failed, trying Method 3...');
      console.log('req.body.messages type:', typeof req.body.messages);
      console.log('req.body.messages value:', req.body.messages);
      
      try {
        let parsedMessages = req.body.messages;
        
        // If it's a string, try to parse it as JSON
        if (typeof parsedMessages === 'string') {
          parsedMessages = JSON.parse(parsedMessages);
        }
        
        // If it's an array, use it directly
        if (Array.isArray(parsedMessages)) {
          parsedMessages.forEach(msg => {
            if (msg && typeof msg === 'string' && msg.trim()) {
              messages.push(msg.trim());
            }
          });
        }
      } catch (parseError) {
        console.error('Error parsing messages:', parseError);
      }
    }

    console.log('Final parsed messages:', messages); // This should show ["loving", "loving"]

    let images = [];
    let video = null;

    // Fetch template information
    const templateData = await Template.findById(templateId);
    if (!templateData) {
      return res.status(400).json({ error: 'Template not found' });
    }

    console.log('Found template:', templateData);

    // Handle file uploads (multer should provide req.files)
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of imageFiles) {
        if (file && file.path) {
          console.log('Uploading image:', file.path);
          const upload = await cloudinary.uploader.upload(file.path, {
            folder: 'memories/images'
          });
          images.push(upload.secure_url);
          console.log('Image uploaded:', upload.secure_url);
        }
      }
    }

    if (req.files && req.files.video && req.files.video[0]) {
      console.log('Uploading video:', req.files.video[0].path);
      const upload = await cloudinary.uploader.upload(req.files.video[0].path, {
        folder: 'memories/videos',
        resource_type: 'video'
      });
      video = upload.secure_url;
      console.log('Video uploaded:', upload.secure_url);
    }

    // Create memory object
    const memoryData = {
      name,
      birth,
      burial,
      template: {
        templateId: templateData._id,
        templateNumber: templateData.templateNumber,
        previewImage: templateData.previewImage
      },
      messages, // ✅ This should now contain the parsed messages
      images,
      video,
      email,
      avatar
    };

    console.log('Creating memory with data:', memoryData); // Debug log

    const memory = new Memory(memoryData);
    await memory.save();
    
    console.log('Memory saved successfully:', memory);
    console.log('Saved messages:', memory.messages); // Verify messages were saved
    
    res.status(201).json(memory);
  } catch (err) {
    console.error('Error creating memory:', err);
    res.status(500).json({ error: err.message });
  }
};

const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    console.log('Retrieved memories with messages:', memories.map(m => ({ id: m._id, messages: m.messages })));
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMemoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const memory = await Memory.findById(id);
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    res.json(memory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const approveMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const memory = await Memory.findByIdAndUpdate(
      id, 
      { 
        approved: true,
        approvedAt: new Date()
      }, 
      { new: true }
    );
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    res.json(memory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMemory, getMemories, getMemoryById, approveMemory };