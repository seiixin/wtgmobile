const express = require('express');
const { createServiceRequest, verifyToken } = require('../controllers/serviceRequestController');

const router = express.Router();

// Route to create a service request (protected)
router.post('/create', verifyToken, createServiceRequest);

module.exports = router;
