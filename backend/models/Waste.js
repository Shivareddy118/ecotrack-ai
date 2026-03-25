const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, required: true },
  confidence: { type: Number, default: 0 },
  isPlastic: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Waste', wasteSchema);
