const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  getTemplates,
  createTemplate,
  removeTemplate
} = require('../controllers/templateController');

router.get('/', getTemplates);
router.post('/', upload.single('previewImage'), createTemplate);
router.delete('/:id', removeTemplate);

module.exports = router;