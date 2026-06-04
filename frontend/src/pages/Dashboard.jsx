// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart, TrendingUp, Package, Wrench, AlertTriangle,
    Users, DollarSign, Clock, Plus, Download, RefreshCw,
    ChevronDown, Filter, Eye, Edit2, Trash2
} from 'lucide-react';
import StatCard from '../components/StatCard';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';

// ألوان الرسوم البيانية
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('today');
    const [chartType, setChartType] = useState('sales');

    // جلب البيانات من الباك إند
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // جلب الإحصائيات
            const [statsRes, salesRes, productsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/sales?limit=5'),
                api.get('/products?lowStock=true&limit=5')
            ]);

            setStats(statsRes.data);
            setRecentSales(salesRes.data);
            setLowStockProducts(productsRes.data);

            // توليد بيانات الرسم البياني (يمكن استبدالها بـ API حقيقي)
            generateChartData(dateRange);

        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('فشل تحميل البيانات. تأكد من اتصال السيرفر.');
            toast.error('حدث خطأ أثناء تحميل الداشبورد');

            // بيانات احتياطية للتجربة
            setStats({
                dailySales: { total: 45200, count: 12 },
                monthlySales: { total: 385000, count: 89 },
                totalProducts: 456,
                pendingMaintenance: 8,
                dailyExpenses: { total: 2800 },
                lowStock: 15,
                totalDebt: 28500,
                monthlyProfit: 125000,
            });
            generateChartData(dateRange);
        } finally {
            setLoading(false);
        }
    };

    // توليد بيانات الرسم البياني حسب الفترة
    const generateChartData = (range) => {
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];

        let labels = range === 'today' ? ['ص', 'م', 'ع', 'ل'] :
            range === 'week' ? days.slice(0, 7) : months.slice(0, 6);

        const data = labels.map((label, i) => ({
            name: label,
            sales: Math.floor(Math.random() * 30000) + 5000,
            profit: Math.floor(Math.random() * 20000) + 3000,
            expenses: Math.floor(Math.random() * 10000) + 1000,
        }));

        setChartData(data);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!loading) generateChartData(dateRange);
    }, [dateRange]);

    // إعادة التحميل
    const handleRefresh = () => {
        fetchDashboardData();
        toast.success('تم تحديث البيانات');
    };

    // تصدير التقرير
    const handleExport = () => {
        toast.success('جاري تحضير التقرير...');
        // هنا يمكن إضافة منطق التصدير الفعلي
        setTimeout(() => {
            toast.success('تم تصدير التقرير بنجاح! 📄');
        }, 1500);
    };

    // أزرار الإجراءات السريعة
    const quickActions = [
        { icon: Plus, label: 'منتج جديد', path: '/inventory/new', color: 'bg-blue-500' },
        { icon: ShoppingCart, label: 'فاتورة جديدة', path: '/sales/new', color: 'bg-green-500' },
        { icon: Users, label: 'عميل جديد', path: '/customers/new', color: 'bg-purple-500' },
        { icon: Wrench, label: 'طلب صيانة', path: '/maintenance/new', color: 'bg-orange-500' },
    ];

    if (loading && !stats) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-dark-400 text-lg">جاري تحميل لوحة التحكم...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 page-enter">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 to-purple-500/10"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-dark-100">
                            لوحة التحكم 📊
                        </h1>
                        <p className="text-dark-400 mt-1">
                            {new Date().toLocaleDateString('ar-EG', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Date Filter */}
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="input-dark px-4 py-2 pr-10 rounded-xl text-sm appearance-none cursor-pointer"
                            >
                                <option value="today">اليوم</option>
                                <option value="week">هذا الأسبوع</option>
                                <option value="month">هذا الشهر</option>
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" size={16} />
                        </div>

                        {/* Actions */}
                        <button
                            onClick={handleRefresh}
                            className="p-2.5 rounded-xl bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
                            title="تحديث البيانات"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={handleExport}
                            className="p-2.5 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                            title="تصدير التقرير"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
                {quickActions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.label}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toast.success(`سيتم الانتقال إلى: ${action.label}`)}
                            className="glass rounded-xl p-4 flex flex-col items-center gap-2 card-hover group"
                        >
                            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                                <Icon size={20} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-dark-300 group-hover:text-dark-100 transition-colors">
                                {action.label}
                            </span>
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="مبيعات اليوم"
                    value={`${stats?.dailySales?.total?.toLocaleString() || 0} ج.م`}
                    subValue={`${stats?.dailySales?.count || 0} عملية`}
                    icon={ShoppingCart}
                    color="from-green-500 to-emerald-600"
                    trend={12}
                    delay={0.1}
                />
                <StatCard
                    title="مبيعات الشهر"
                    value={`${stats?.monthlySales?.total?.toLocaleString() || 0} ج.م`}
                    subValue={`${stats?.monthlySales?.count || 0} عملية`}
                    icon={TrendingUp}
                    color="from-blue-500 to-indigo-600"
                    trend={8}
                    delay={0.2}
                />
                <StatCard
                    title="صافي الأرباح"
                    value={`${stats?.monthlyProfit?.toLocaleString() || 0} ج.م`}
                    icon={DollarSign}
                    color="from-purple-500 to-pink-600"
                    trend={15}
                    delay={0.3}
                />
                <StatCard
                    title="مصروفات اليوم"
                    value={`${stats?.dailyExpenses?.total?.toLocaleString() || 0} ج.م`}
                    icon={AlertTriangle}
                    color="from-red-500 to-orange-600"
                    trend={-5}
                    isNegative
                    delay={0.4}
                />
                <StatCard
                    title="إجمالي المنتجات"
                    value={stats?.totalProducts || 0}
                    icon={Package}
                    color="from-cyan-500 to-blue-600"
                    delay={0.5}
                />
                <StatCard
                    title="طلبات الصيانة"
                    value={stats?.pendingMaintenance || 0}
                    icon={Wrench}
                    color="from-amber-500 to-yellow-600"
                    delay={0.6}
                />
                <StatCard
                    title="الديون المستحقة"
                    value={`${stats?.totalDebt?.toLocaleString() || 0} ج.م`}
                    icon={Users}
                    color="from-rose-500 to-red-600"
                    delay={0.7}
                />
                <StatCard
                    title="⚠️ مخزون منخفض"
                    value={stats?.lowStock || 0}
                    icon={Clock}
                    color="from-orange-500 to-red-600"
                    isWarning
                    delay={0.8}
                />
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2"
                >
                    <AlertTriangle size={16} />
                    {error}
                </motion.div>
            )}

            {/* Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 glass rounded-2xl p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-dark-200">📈 تحليل الأداء</h3>

                        {/* Chart Type Toggle */}
                        <div className="flex gap-1 bg-dark-800 rounded-lg p-1">
                            {[
                                { id: 'sales', label: 'المبيعات' },
                                { id: 'profit', label: 'الأرباح' },
                                { id: 'expenses', label: 'المصروفات' },
                            ].map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setChartType(type.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${chartType === type.id
                                            ? 'bg-primary-500 text-white'
                                            : 'text-dark-400 hover:text-dark-200'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        {chartType === 'sales' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}ك`} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '0.75rem',
                                        color: '#e2e8f0',
                                        fontFamily: 'Cairo, sans-serif',
                                    }}
                                    formatter={(value) => [`${value.toLocaleString()} ج.م`, 'القيمة']}
                                />
                                <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} name="المبيعات" />
                                <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="المصروفات" />
                            </BarChart>
                        ) : chartType === 'profit' ? (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}ك`} />
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '0.75rem',
                                        color: '#e2e8f0',
                                        fontFamily: 'Cairo, sans-serif',
                                    }}
                                    formatter={(value) => [`${value.toLocaleString()} ج.م`, 'الربح']}
                                />
                                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} name="صافي الربح" />
                            </LineChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'مبيعات', value: stats?.dailySales?.total || 0 },
                                        { name: 'مصروفات', value: stats?.dailyExpenses?.total || 0 },
                                        { name: 'أرباح', value: (stats?.dailySales?.total - stats?.dailyExpenses?.total) || 0 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {[0, 1, 2].map((index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '0.75rem',
                                        color: '#e2e8f0',
                                        fontFamily: 'Cairo, sans-serif',
                                    }}
                                    formatter={(value) => [`${value.toLocaleString()} ج.م`, '']}
                                />
                                <Legend verticalAlign="bottom" height={36} formatter={(v) => <span className="text-dark-300 text-sm">{v}</span>} />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </motion.div>

                {/* Alerts & Low Stock */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    {/* Alerts */}
                    <div className="glass rounded-2xl p-5">
                        <h3 className="text-lg font-semibold text-dark-200 mb-4">🔔 التنبيهات</h3>
                        <div className="space-y-3">
                            {[
                                { type: 'danger', text: 'قسط متأخر - محمد عبدالله (1,500 ج.م)', time: 'منذ يومين' },
                                { type: 'warning', text: `⚠️ ${stats?.lowStock || 0} منتجات قاربت على النفاد`, time: 'حالي' },
                                { type: 'info', text: 'جهاز صيانة جديد في الانتظار', time: 'منذ ساعة' },
                            ].map((alert, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className={`p-3 rounded-xl border ${alert.type === 'danger' ? 'border-red-500/30 bg-red-500/5' :
                                            alert.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                                                'border-blue-500/30 bg-blue-500/5'
                                        }`}
                                >
                                    <p className="text-sm text-dark-200">{alert.text}</p>
                                    <p className="text-xs text-dark-500 mt-1">{alert.time}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Preview */}
                    <div className="glass rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-dark-200">⚠️ مخزون منخفض</h3>
                            <button className="text-primary-400 text-xs hover:text-primary-300 transition-colors">
                                عرض الكل ←
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(lowStockProducts.length > 0 ? lowStockProducts : [
                                { name: 'iPhone 15 Pro', quantity: 2, alertQuantity: 5 },
                                { name: 'AirPods Pro', quantity: 3, alertQuantity: 5 },
                                { name: 'Samsung S24', quantity: 1, alertQuantity: 3 },
                            ]).slice(0, 3).map((product, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-dark-800/50 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-dark-200 truncate">{product.name}</p>
                                        <div className="w-full bg-dark-700 rounded-full h-1.5 mt-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all ${product.quantity <= 1 ? 'bg-red-500' :
                                                        product.quantity <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min((product.quantity / product.alertQuantity) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold mr-3 ${product.quantity <= 1 ? 'text-red-400' : 'text-yellow-400'
                                        }`}>
                                        {product.quantity}/{product.alertQuantity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Sales Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-2xl p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-dark-200">📋 آخر المبيعات</h3>
                    <button className="text-primary-400 text-sm hover:text-primary-300 transition-colors flex items-center gap-1">
                        <Eye size={14} />
                        عرض الكل
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-right text-dark-400 text-xs border-b border-dark-800">
                                <th className="pb-3 font-medium">رقم الفاتورة</th>
                                <th className="pb-3 font-medium">العميل</th>
                                <th className="pb-3 font-medium">المبلغ</th>
                                <th className="pb-3 font-medium">طريقة الدفع</th>
                                <th className="pb-3 font-medium">الوقت</th>
                                <th className="pb-3 font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(recentSales.length > 0 ? recentSales : [
                                { id: 'INV-001234', customer: 'أحمد محمد', amount: 15500, method: 'نقدي', time: '10:30 ص' },
                                { id: 'INV-001233', customer: 'سارة علي', amount: 850, method: 'فودافون كاش', time: '09:45 ص' },
                                { id: 'INV-001232', customer: 'محمود حسن', amount: 3200, method: 'إنستا باي', time: '09:15 ص' },
                                { id: 'INV-001231', customer: 'فاطمة أحمد', amount: 12000, method: 'أقساط', time: '08:30 ص' },
                            ]).map((sale, i) => (
                                <motion.tr
                                    key={sale.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.05 }}
                                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                                >
                                    <td className="py-3 font-mono text-primary-400 text-sm">{sale.id}</td>
                                    <td className="py-3 text-dark-200 text-sm">{sale.customer}</td>
                                    <td className="py-3 font-semibold text-dark-100">{sale.amount.toLocaleString()} ج.م</td>
                                    <td className="py-3">
                                        <span className="px-2.5 py-1 rounded-lg text-xs bg-dark-800 text-dark-300 border border-dark-700">
                                            {sale.method}
                                        </span>
                                    </td>
                                    <td className="py-3 text-dark-400 text-sm">{sale.time}</td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 rounded-lg text-dark-400 hover:text-blue-400 hover:bg-dark-800 transition-colors">
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-1.5 rounded-lg text-dark-400 hover:text-green-400 hover:bg-dark-800 transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}