const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    ticketNumber: { type: String, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    deviceType: String,
    brand: String,
    model: String,
    problem: { type: String, required: true },
    password: String,
    attachments: [String],
    customerNotes: String,
    status: {
        type: String,
        enum: ['new', 'checking', 'repairing', 'waiting_parts', 'repaired', 'delivered'],
        default: 'new'
    },
    technician: String,
    cost: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0 },
    receivedDate: { type: Date, default: Date.now },
    deliveredDate: Date,
    notes: String
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);