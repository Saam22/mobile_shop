const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Product = require('../models/Product');

// Get Dashboard Stats (Alternative Endpoint)
router.get('/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailySales = await Sale.aggregate([
            { $match: { date: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
        ]);

        const monthlyExpenses = await Expense.aggregate([
            { $match: { date: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const lowStockProducts = await Product.countDocuments({
            $expr: { $lte: ['$quantity', '$alertQuantity'] }
        });

        res.json({
            dailySales: dailySales[0] || { total: 0, count: 0 },
            monthlyExpenses: monthlyExpenses[0] || { total: 0 },
            lowStockProducts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;