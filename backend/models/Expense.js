const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['electricity', 'water', 'internet', 'rent', 'salaries', 'transport', 'shop_maintenance', 'cleaning', 'taxes', 'other'],
        required: true
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: String,
    employee: String
});

module.exports = mongoose.model('Expense', expenseSchema);