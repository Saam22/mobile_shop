const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');

router.post('/wallets', async (req, res) => {
    try {
        const wallet = new Wallet(req.body);
        await wallet.save();
        res.status(201).json(wallet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/wallets', async (req, res) => {
    try {
        const wallets = await Wallet.find();
        res.json(wallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/wallets/:id/transaction', async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        const { type, amount, fee, notes } = req.body;

        let balanceChange = amount;
        if (type === 'deposit') balanceChange = amount - (fee || 0);
        if (type === 'withdraw') balanceChange = -(amount + (fee || 0));

        wallet.balance += balanceChange;
        wallet.transactions.push({ type, amount, fee: fee || 0, notes });

        await wallet.save();
        res.json(wallet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;