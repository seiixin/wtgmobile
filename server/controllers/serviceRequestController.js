const ServiceRequest = require('../models/ServiceRequest');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from the 'Authorization' header
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.userId = decoded.userId; // Attach userId to request object
    next(); // Proceed to the next middleware or route handler
  });
};

// Create a new service request
const createServiceRequest = async (req, res) => {
  const { userId, serviceName, price } = req.body;

  try {
    const newRequest = new ServiceRequest({
      userId,
      serviceName,
      price,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Service request created successfully', data: newRequest });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ message: 'Failed to create service request' });
  }
};

// Get all service requests for a user
const getServiceRequestsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await ServiceRequest.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ data: requests });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ message: 'Failed to fetch service requests' });
  }
};

// Update the status of a service request
const updateServiceRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.status(200).json({ message: 'Service request updated successfully', data: updatedRequest });
  } catch (error) {
    console.error('Error updating service request:', error);
    res.status(500).json({ message: 'Failed to update service request' });
  }
};

module.exports = {
  verifyToken,
  createServiceRequest,
  getServiceRequestsByUser,
  updateServiceRequestStatus,
};
