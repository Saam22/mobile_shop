const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: String,
    nationalId: String,
    notes: String,
    totalPurchases: { type: Number, default: 0 },
    totalDebt: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);