const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String }, // URL or path to avatar image
  graveDetails: {
    deceasedName: String,
    dateOfBurial: String,
    dateOfDeath: String,
    phaseBlk: String,
    category: String,
    apartmentNo: String,
  },
  services: [
    {
      serviceName: String,
      price: Number,
      icon: String, // optional: path to icon
    }
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String }, // e.g. 'gcash', 'cash', 'maya'
  status: { type: String, default: 'pending' }, // 'pending', 'paid'
  orderTime: { type: Date, default: Date.now },
  paymentTime: { type: Date }
});

module.exports = mongoose.model('Transaction', transactionSchema);