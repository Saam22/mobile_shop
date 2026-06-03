const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم الموظف مطلوب']
    },
    phone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب'],
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'sales', 'technician', 'cashier', 'manager'],
        default: 'sales'
    },
    salary: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    // بيانات الحضور والانصراف لليوم الحالي
    attendance: {
        checkIn: { type: Date },
        checkOut: { type: Date },
        date: { type: Date, default: Date.now }
    },
    // الرصيد المالي (سلف وخصومات)
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', employeeSchema);