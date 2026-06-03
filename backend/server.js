require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mobileshop')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// Import Routes
const productRoutes = require('./routes/products');
const saleRoutes = require('./routes/sales');
const customerRoutes = require('./routes/customers');
const maintenanceRoutes = require('./routes/maintenance');
const expenseRoutes = require('./routes/expenses');
const employeeRoutes = require('./routes/employees');
const treasuryRoutes = require('./routes/treasury');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/treasury', treasuryRoutes);


// Daily Stats Endpoint
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const [dailySales, monthlySales, products, pendingMaintenance, expenses] = await Promise.all([
            mongoose.model('Sale').aggregate([
                { $match: { date: { $gte: today } } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            mongoose.model('Sale').aggregate([
                { $match: { date: { $gte: monthStart } } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            mongoose.model('Product').find().countDocuments(),
            mongoose.model('Maintenance').find({ status: { $in: ['new', 'checking', 'repairing', 'waiting_parts'] } }).countDocuments(),
            mongoose.model('Expense').aggregate([
                { $match: { date: { $gte: today } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        res.json({
            dailySales: dailySales[0] || { total: 0, count: 0 },
            monthlySales: monthlySales[0] || { total: 0, count: 0 },
            totalProducts: products,
            pendingMaintenance,
            dailyExpenses: expenses[0] || { total: 0 },
            lowStock: await mongoose.model('Product').find().where('quantity').lte('alertQuantity').countDocuments()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Auto Backup Cron (Daily at 2 AM)
cron.schedule('0 2 * * *', async () => {
    console.log('🔄 Running automatic backup...');
    // Implement backup logic here
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));