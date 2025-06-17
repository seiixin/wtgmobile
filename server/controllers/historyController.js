const History = require('../models/History');

// Add a grave to user's history
exports.addHistory = async (req, res) => {
  const { userId, grave } = req.body;
  if (!userId || !grave) return res.status(400).json({ error: 'userId and grave are required' });

  // Remove duplicate (same grave for same user)
  await History.deleteMany({ userId, 'grave._id': grave._id });

  // Add new history entry
  const newHistory = new History({ userId, grave });
  await newHistory.save();

  res.status(201).json(newHistory);
};

// Get user's history (most recent first)
exports.getHistory = async (req, res) => {
  const { userId } = req.params;
  const history = await History.find({ userId }).sort({ searchedAt: -1 });
  res.json(history);
};

// Clear user's history
exports.clearHistory = async (req, res) => {
  const { userId } = req.params;
  await History.deleteMany({ userId });
  res.json({ message: 'History cleared' });
};