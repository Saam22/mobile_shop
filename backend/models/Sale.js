const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: String,
    customerPhone: String,
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        unitPrice: Number,
        purchasePrice: Number,
        subtotal: Number
    }],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: Number,
    paymentMethod: {
        type: String,
        enum: ['cash', 'vodafone_cash', 'etisalat_cash', 'we_pay', 'instapay', 'bank_transfer'],
        default: 'cash'
    },
    paid: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    isInstallment: { type: Boolean, default: false },
    installments: [{
        dueDate: Date,
        amount: Number,
        paid: { type: Boolean, default: false },
        paidDate: Date
    }],
    notes: String,
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['completed', 'returned', 'exchanged'], default: 'completed' }
});

module.exports = mongoose.model('Sale', saleSchema);