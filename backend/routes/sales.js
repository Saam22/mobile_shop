const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// Generate invoice number
const generateInvoiceNumber = async () => {
    const count = await Sale.countDocuments();
    return `INV-${String(count + 1).padStart(6, '0')}`;
};

// Create sale
router.post('/', async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const invoiceNumber = await generateInvoiceNumber();

            const sale = new Sale({
                ...req.body,
                invoiceNumber
            });

            // Update product quantities
            for (const item of req.body.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { quantity: -item.quantity } },
                    { session }
                );
            }

            // Update or create customer
            if (req.body.customer) {
                await Customer.findByIdAndUpdate(
                    req.body.customer,
                    { $inc: { totalPurchases: req.body.total } },
                    { session }
                );
            }

            await sale.save({ session });
            await session.commitTransaction();

            res.status(201).json(sale);
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('customer', 'name phone')
            .sort({ date: -1 });
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Return/Exchange sale
router.patch('/:id/return', async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);
        sale.status = req.body.type === 'exchange' ? 'exchanged' : 'returned';
        sale.notes = req.body.reason;

        // Restore product quantities
        for (const item of sale.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { quantity: item.quantity }
            });
        }

        await sale.save();
        res.json(sale);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;