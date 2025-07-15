const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createMemory, getMemories, getMemoryById, approveMemory } = require('../controllers/memoryController'); // Add approveMemory

// Multer config for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// POST /api/memories - create a memory (images[] and video as multipart/form-data)
router.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 }
  ]),
  createMemory
);

// GET /api/memories - list all memories
router.get('/', getMemories);

// GET /api/memories/:id - get specific memory
router.get('/:id', getMemoryById);

module.exports = router;
