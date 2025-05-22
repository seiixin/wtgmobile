const express = require('express');
const router = express.Router();
const graveController = require('../controllers/graveController');

// Search graves by firstname or lastname
router.get('/search', graveController.searchGraves);

module.exports = router;