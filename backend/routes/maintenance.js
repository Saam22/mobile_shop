const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');

const generateTicketNumber = async () => {
    const count = await Maintenance.countDocuments();
    return `MTN-${String(count + 1).padStart(6, '0')}`;
};

router.post('/', async (req, res) => {
    try {
        const ticketNumber = await generateTicketNumber();
        const maintenance = new Maintenance({ ...req.body, ticketNumber });
        await maintenance.save();
        res.status(201).json(maintenance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { customerName: new RegExp(search, 'i') },
                { customerPhone: new RegExp(search, 'i') },
                { ticketNumber: new RegExp(search, 'i') }
            ];
        }
        const maintenance = await Maintenance.find(query).sort({ receivedDate: -1 });
        res.json(maintenance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/status', async (req, res) => {
    try {
        const maintenance = await Maintenance.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (req.body.status === 'delivered') {
            maintenance.deliveredDate = new Date();
            await maintenance.save();
        }
        res.json(maintenance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;