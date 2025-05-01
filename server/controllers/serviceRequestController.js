const ServiceRequest = require('../models/ServiceRequest');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from the 'Authorization' header
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.userId = decoded.userId; // Attach userId to request object
    next();  // Proceed to the next middleware or route handler
  });
};

// Create a new service request
const createServiceRequest = async (req, res) => {
  const { serviceName, price, description } = req.body;

  try {
    // Create a new service request using the data from request body
    const newServiceRequest = new ServiceRequest({
      serviceName,
      price,
      description,
      userId: req.userId,  // Use the userId from the JWT token
    });

    // Save the service request to the database
    await newServiceRequest.save();

    // Return success message with the created service request
    res.status(201).json({
      success: true,
      message: 'Service request created successfully!',
      data: newServiceRequest,
    });
  } catch (error) {
    // Return error message if something goes wrong
    res.status(500).json({
      message: 'Error creating service request',
      error: error.message,
    });
  }
};

module.exports = { createServiceRequest, verifyToken };
