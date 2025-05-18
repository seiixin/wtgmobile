const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransactionPayment,
} = require('../controllers/transactionController');

// Create a new transaction
router.post('/', createTransaction);

// Get all transactions for a user
router.get('/user/:userId', getTransactionsByUser);

// Get a single transaction by ID
router.get('/:id', getTransactionById);

// Update payment info
router.put('/:id/payment', updateTransactionPayment);

module.exports = router;