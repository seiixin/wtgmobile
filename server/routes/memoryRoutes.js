const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createMemory, getMemories } = require('../controllers/memoryController');

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

module.exports = router;