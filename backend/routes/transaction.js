const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// POST /api/transaction/scan
router.post('/scan', protect, async (req, res) => {
  try {
    const { vendorId, vendorName } = req.body;
    if (!vendorId) return res.status(400).json({ message: 'Vendor ID required' });

    const transaction = await Transaction.create({
      userId: req.user._id,
      vendorId,
      vendorName: vendorName || 'Campus Vendor',
      plasticSaved: 1,
      creditsEarned: 10
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { greenCredits: 10, plasticAvoided: 1 } },
      { new: true }
    ).select('-password');

    res.status(201).json({
      message: '✅ QR Scanned! +10 Green Credits earned!',
      transaction,
      user: { greenCredits: user.greenCredits, plasticAvoided: user.plasticAvoided }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/transaction/my-history
router.get('/my-history', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 }).limit(20);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
