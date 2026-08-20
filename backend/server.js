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
app.use('/api/auth', require('./routes/auth'));

// Dashboard Stats Endpoint
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const { range = 'today' } = req.query;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfPrevDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startOfPrevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

        const startDate = range === 'week'
            ? new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
            : range === 'month' ? startOfMonth : startOfDay;

        const Sale = mongoose.model('Sale');
        const Product = mongoose.model('Product');
        const Maintenance = mongoose.model('Maintenance');
        const Expense = mongoose.model('Expense');
        const Customer = mongoose.model('Customer');
        const Employee = mongoose.model('Employee');

        const dateBucket = range === 'today'
            ? { $dateToString: { format: '%H:00', date: '$date' } }
            : { $dateToString: { format: '%Y-%m-%d', date: '$date' } };

        const [rangeSales, todaySales, monthSales, prevDaySales, prevMonthSales,
            rangeExpenses, dayExpenses, monthExpenses, prevMonthExpenses,
            rangeProfit, salesByBucket, profitByBucket, expensesByBucket,
            totalProducts, pendingMaintenance, lowStock, debtAgg, totalCustomers, activeEmployees, overdueSales] = await Promise.all([
            // مبيعات الفترة المحددة
            Sale.aggregate([
                { $match: { date: { $gte: startDate }, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            // مبيعات اليوم
            Sale.aggregate([
                { $match: { date: { $gte: startOfDay }, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            // مبيعات الشهر
            Sale.aggregate([
                { $match: { date: { $gte: startOfMonth }, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            // مبيعات أمس (لحساب الاتجاه)
            Sale.aggregate([
                { $match: { date: { $gte: startOfPrevDay, $lt: startOfDay }, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            // مبيعات الشهر السابق (لحساب الاتجاه)
            Sale.aggregate([
                { $match: { date: { $gte: startOfPrevMonth, $lt: startOfPrevMonthEnd }, status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            // مصروفات الفترة المحددة
            Expense.aggregate([
                { $match: { date: { $gte: startDate } } },
                { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
            ]),
            // مصروفات اليوم
            Expense.aggregate([
                { $match: { date: { $gte: startOfDay } } },
                { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
            ]),
            // مصروفات الشهر
            Expense.aggregate([
                { $match: { date: { $gte: startOfMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
            ]),
            // مصروفات الشهر السابق
            Expense.aggregate([
                { $match: { date: { $gte: startOfPrevMonth, $lt: startOfPrevMonthEnd } } },
                { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
            ]),
            // ربح الفترة المحددة (سعر البيع - سعر الشراء)
            Sale.aggregate([
                { $match: { date: { $gte: startDate }, status: 'completed' } },
                { $unwind: '$items' },
                { $group: { _id: null, total: { $sum: { $subtract: [{ $multiply: ['$items.unitPrice', '$items.quantity'] }, { $multiply: ['$items.purchasePrice', '$items.quantity'] }] } } } }
            ]),
            // مبيعات الفترة مقسمة (للرسم البياني)
            Sale.aggregate([
                { $match: { date: { $gte: startDate }, status: 'completed' } },
                { $group: { _id: dateBucket, sales: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            // أرباح الفترة مقسمة (للرسم البياني)
            Sale.aggregate([
                { $match: { date: { $gte: startDate }, status: 'completed' } },
                { $unwind: '$items' },
                { $group: { _id: dateBucket, profit: { $sum: { $subtract: [{ $multiply: ['$items.unitPrice', '$items.quantity'] }, { $multiply: ['$items.purchasePrice', '$items.quantity'] }] } } } }
            ]),
            // مصروفات الفترة مقسمة (للرسم البياني)
            Expense.aggregate([
                { $match: { date: { $gte: startDate } } },
                { $group: { _id: dateBucket, expenses: { $sum: '$amount' } } }
            ]),
            Product.find().countDocuments(),
            Maintenance.find({ status: { $in: ['new', 'checking', 'repairing', 'waiting_parts'] } }).countDocuments(),
            Product.collection.aggregate([{ $match: { $expr: { $lte: ['$quantity', '$alertQuantity'] } } }, { $count: 'count' }]).toArray(),
            Customer.collection.aggregate([{ $group: { _id: null, total: { $sum: '$totalDebt' } } }]).toArray(),
            Customer.find().countDocuments(),
            Employee.find({ status: 'active' }).countDocuments(),
            Sale.find({ status: 'completed', 'installments.paid': false, 'installments.dueDate': { $lt: now } }),
        ]);

        // بناء بيانات الرسم البياني
        const chartMap = {};
        for (const row of salesByBucket) chartMap[row._id] = { name: row._id, sales: row.sales, profit: 0, expenses: 0 };
        for (const row of profitByBucket) {
            if (!chartMap[row._id]) chartMap[row._id] = { name: row._id, sales: 0, profit: 0, expenses: 0 };
            chartMap[row._id].profit = row.profit;
        }
        for (const row of expensesByBucket) {
            if (!chartMap[row._id]) chartMap[row._id] = { name: row._id, sales: 0, profit: 0, expenses: 0 };
            chartMap[row._id].expenses = row.expenses;
        }
        const chartData = Object.values(chartMap)
            .sort((a, b) => a.name.localeCompare(b.name, 'en'))
            .map(row => ({
                name: range === 'today' ? row.name : new Date(row.name + 'T00:00:00').toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric' }),
                sales: row.sales,
                profit: row.profit,
                expenses: row.expenses,
            }));

        const overdueTotal = overdueSales.reduce((sum, s) => {
            const unpaid = s.installments.filter(i => !i.paid && i.dueDate < now);
            return sum + unpaid.reduce((a, i) => a + i.amount, 0);
        }, 0);

        const rangeSalesAgg = rangeSales[0] || { total: 0, count: 0 };
        const todaySalesAgg = todaySales[0] || { total: 0, count: 0 };
        const monthSalesAgg = monthSales[0] || { total: 0, count: 0 };
        const prevDayAgg = prevDaySales[0] || { total: 0, count: 0 };
        const prevMonthAgg = prevMonthSales[0] || { total: 0, count: 0 };
        const rangeExpAgg = rangeExpenses[0] || { total: 0, count: 0 };
        const dayExpAgg = dayExpenses[0] || { total: 0, count: 0 };
        const monthExpAgg = monthExpenses[0] || { total: 0, count: 0 };
        const prevMonthExpAgg = prevMonthExpenses[0] || { total: 0, count: 0 };
        const rangeProfitAgg = rangeProfit[0] || { total: 0 };

        const dailyTrend = prevDayAgg.total > 0 ? Math.round(((todaySalesAgg.total - prevDayAgg.total) / prevDayAgg.total) * 100) : null;
        const monthlyTrend = prevMonthAgg.total > 0 ? Math.round(((monthSalesAgg.total - prevMonthAgg.total) / prevMonthAgg.total) * 100) : null;
        const expenseTrend = prevMonthExpAgg.total > 0 ? Math.round(((monthExpAgg.total - prevMonthExpAgg.total) / prevMonthExpAgg.total) * 100) : null;

        res.json({
            range,
            sales: rangeSalesAgg,
            todaySales: todaySalesAgg,
            monthSales: monthSalesAgg,
            monthlyProfit: rangeProfitAgg.total - rangeExpAgg.total,
            dailyTrend,
            monthlyTrend,
            expenseTrend,
            expenses: rangeExpAgg,
            todayExpenses: dayExpAgg,
            monthExpenses: monthExpAgg,
            totalProducts,
            pendingMaintenance,
lowStock: lowStock[0]?.count || 0,
            totalDebt: debtAgg[0]?.total || 0,
            totalCustomers,
            activeEmployees,
            overdue: { count: overdueSales.length, total: overdueTotal },
            chartData,
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