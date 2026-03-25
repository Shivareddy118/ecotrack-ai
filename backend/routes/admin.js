const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Waste = require('../models/Waste');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/admin/leaderboard (public)
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name greenCredits plasticAvoided')
      .sort({ greenCredits: -1 })
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/plastic-detected
router.post('/plastic-detected', protect, async (req, res) => {
  try {
    const { label, confidence, isPlastic } = req.body;
    const waste = await Waste.create({
      userId: req.user._id, label, confidence, isPlastic: isPlastic || false
    });
    res.status(201).json({ message: 'Waste detection logged', waste });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/plastic-stats
router.get('/plastic-stats', protect, adminOnly, async (req, res) => {
  try {
    const totalDetections = await Waste.countDocuments();
    const plasticDetections = await Waste.countDocuments({ isPlastic: true });
    const totalCreditsResult = await User.aggregate([{ $group: { _id: null, total: { $sum: '$greenCredits' } } }]);
    const totalPlasticAvoided = await User.aggregate([{ $group: { _id: null, total: { $sum: '$plasticAvoided' } } }]);
    const totalTransactions = await Transaction.countDocuments();
    const recentWaste = await Waste.find().sort({ date: -1 }).limit(10).populate('userId', 'name');
    const weeklyData = await Transaction.aggregate([
      { $group: { _id: { $dayOfWeek: '$date' }, count: { $sum: 1 }, credits: { $sum: '$creditsEarned' } } },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      totalDetections,
      plasticDetections,
      totalCreditsIssued: totalCreditsResult[0]?.total || 0,
      totalPlasticAvoided: totalPlasticAvoided[0]?.total || 0,
      totalTransactions,
      recentWaste,
      weeklyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/redeem
router.post('/redeem', protect, async (req, res) => {
  try {
    const { credits } = req.body;
    if (!credits || credits <= 0) return res.status(400).json({ message: 'Invalid credits amount' });

    const user = await User.findById(req.user._id);
    if (user.greenCredits < credits) return res.status(400).json({ message: 'Insufficient credits' });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { greenCredits: -credits } },
      { new: true }
    ).select('-password');

    res.json({ message: `✅ ${credits} credits redeemed successfully!`, greenCredits: updated.greenCredits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
