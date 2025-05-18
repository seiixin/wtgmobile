const Transaction = require('../models/Transaction');

// Create a new transaction (order summary)
const createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    res.status(201).json({ message: 'Transaction created', data: transaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction', error });
  }
};

// Get all transactions for a user
const getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({ orderTime: -1 });
    res.status(200).json({ data: transactions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error });
  }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({ data: transaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transaction', error });
  }
};

// Update payment status and method
const updateTransactionPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, status, paymentTime } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { paymentMethod, status, paymentTime },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({ message: 'Transaction updated', data: transaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update transaction', error });
  }
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  getTransactionById,
  updateTransactionPayment,
};