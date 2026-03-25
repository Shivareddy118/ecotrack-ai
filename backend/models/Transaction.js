const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, default: 'Campus Vendor' },
  plasticSaved: { type: Number, default: 1 },
  creditsEarned: { type: Number, default: 10 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
