const express = require('express');
const router = express.Router();
const {
  createServiceRequest,
  getServiceRequestsByUser,
  updateServiceRequestStatus,
} = require('../controllers/serviceRequestController');

// Route to create a new service request
router.post('/', createServiceRequest);

// Route to get all service requests for a specific user
router.get('/:userId', getServiceRequestsByUser);

// Route to update the status of a specific service request
router.put('/:requestId', updateServiceRequestStatus);

module.exports = router;