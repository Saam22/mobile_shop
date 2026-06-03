const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['vodafone_cash', 'etisalat_cash', 'we_pay', 'instapay', 'bank'], required: true },
    number: String,
    iban: String,
    balance: { type: Number, default: 0 },
    transactions: [{
        type: { type: String, enum: ['deposit', 'withdraw', 'transfer', 'receive'] },
        amount: Number,
        fee: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
        notes: String
    }]
});

module.exports = mongoose.model('Wallet', walletSchema);