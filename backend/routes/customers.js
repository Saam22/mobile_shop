const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

router.post('/', async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ name: 1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/history', async (req, res) => {
    try {
        const sales = await Sale.find({ customer: req.params.id }).sort({ date: -1 });
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;