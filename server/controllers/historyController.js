// const History = require('../models/History');

// // ✅ Add to history ONLY when an item is clicked
// const addToHistory = async (req, res) => {
//     try {
//         const { userId, searchedItem } = req.body;

//         // Check if the item is already in history to prevent duplicates
//         const existingEntry = await History.findOne({ userId, searchedItem });

//         if (!existingEntry) {
//             await History.create({ userId, searchedItem });
//         }

//         res.status(201).json({ message: "Added to history" });
//     } catch (error) {
//         console.error("History Save Error:", error.message || error);
//         res.status(500).json({ message: "Server Error", error: error.message || "Something went wrong" });
//     }
// };

// // ✅ Fetch user’s visited history
// const getUserHistory = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         const history = await History.find({ userId }).sort({ timestamp: -1 });

//         if (!history.length) {
//             return res.status(404).json({ message: "No history found for this user" });
//         }

//         res.json(history);
//     } catch (error) {
//         console.error("Fetch History Error:", error.message || error);
//         res.status(500).json({ message: "Server Error", error: error.message || "Something went wrong" });
//     }
// };

// module.exports = { addToHistory, getUserHistory };
