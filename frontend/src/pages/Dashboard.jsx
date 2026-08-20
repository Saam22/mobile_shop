// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart, TrendingUp, Package, Wrench, AlertTriangle,
    Users, DollarSign, Clock, Plus, Download, RefreshCw,
    ChevronDown, Eye, X, Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';

const paymentLabels = {
    cash: 'نقدي',
    vodafone_cash: 'فودافون كاش',
    etisalat_cash: 'اتصالات كاش',
    we_pay: 'WE Pay',
    instapay: 'إنستا باي',
    bank_transfer: 'تحويل بنكي',
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const tooltipStyle = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '0.75rem',
    color: '#e2e8f0',
    fontFamily: 'Cairo, sans-serif',
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentSales, setRecentSales] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('today');
    const [chartType, setChartType] = useState('sales');
    const [selectedSale, setSelectedSale] = useState(null);

    const fetchDashboardData = useCallback(async (range) => {
        try {
            setLoading(true);
            setError(null);

            const [statsRes, salesRes, productsRes] = await Promise.all([
                api.get('/dashboard/stats', { params: { range } }),
                api.get('/sales'),
                api.get('/products', { params: { lowStock: true } }),
            ]);

            setStats(statsRes.data);
            setRecentSales(salesRes.data.slice(0, 5).map(s => ({
                ...s,
                methodLabel: paymentLabels[s.paymentMethod] || s.paymentMethod,
                timeLabel: new Date(s.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            })));
            setLowStockProducts(productsRes.data);
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('فشل تحميل البيانات. تأكد من اتصال السيرفر.');
            toast.error('حدث خطأ أثناء تحميل الداشبورد');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData(dateRange);
    }, [dateRange, fetchDashboardData]);

    const handleRefresh = () => {
        fetchDashboardData(dateRange);
        toast.success('تم تحديث البيانات');
    };

    const handleExport = () => {
        if (recentSales.length === 0) {
            toast.error('لا توجد مبيعات للتصدير');
            return;
        }
        const header = ['رقم الفاتورة', 'العميل', 'المبلغ', 'طريقة الدفع', 'التاريخ'];
        const rows = recentSales.map(s => [
            s.invoiceNumber,
            s.customerName || s.customer?.name || '-',
            s.total,
            paymentLabels[s.paymentMethod] || s.paymentMethod,
            new Date(s.date).toLocaleString('ar-EG'),
        ]);
        const csv = [header, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mobileshop-report-${dateRange}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('تم تصدير التقرير بنجاح! 📄');
    };

    const quickActions = [
        { icon: Plus, label: 'منتج جديد', path: '/inventory', color: 'bg-blue-500' },
        { icon: ShoppingCart, label: 'فاتورة جديدة', path: '/sales', color: 'bg-green-500' },
        { icon: Users, label: 'عميل جديد', path: '/customers', color: 'bg-purple-500' },
        { icon: Wrench, label: 'طلب صيانة', path: '/maintenance', color: 'bg-orange-500' },
    ];

    const alerts = [];
    if (stats?.overdue?.count > 0) {
        alerts.push({ type: 'danger', text: `قسط متأخر لـ ${stats.overdue.count} فاتورة بإجمالي ${stats.overdue.total.toLocaleString()} ج.م`, time: 'يحتاج متابعة' });
    }
    if (stats?.lowStock > 0) {
        alerts.push({ type: 'warning', text: `${stats.lowStock} منتجات قاربت على النفاد`, time: 'حالي' });
    }
    if (stats?.pendingMaintenance > 0) {
        alerts.push({ type: 'info', text: `${stats.pendingMaintenance} أجهزة صيانة في الانتظار`, time: 'حالي' });
    }
    if (stats?.totalDebt > 0) {
        alerts.push({ type: 'warning', text: `إجمالي ديون العملاء: ${stats.totalDebt.toLocaleString()} ج.م`, time: 'حالي' });
    }
    if (alerts.length === 0) {
        alerts.push({ type: 'info', text: 'لا توجد تنبيهات - كل شيء على ما يرام 🎉', time: 'حالي' });
    }

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

    const pieData = [
        { name: 'مبيعات', value: stats?.todaySales?.total || 0 },
        { name: 'مصروفات', value: stats?.todayExpenses?.total || 0 },
        { name: 'أرباح', value: Math.max((stats?.todaySales?.total - stats?.todayExpenses?.total) || 0, 0) },
    ];

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
                        <h1 className="text-2xl font-bold text-dark-100">لوحة التحكم 📊</h1>
                        <p className="text-dark-400 mt-1">
                            {new Date().toLocaleDateString('ar-EG', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="input-dark px-4 py-2 pr-10 rounded-xl text-sm appearance-none cursor-pointer"
                            >
                                <option value="today">اليوم</option>
                                <option value="week">آخر 7 أيام</option>
                                <option value="month">هذا الشهر</option>
                            </select>
                            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 pointer-events-none" size={16} />
                        </div>

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
                            onClick={() => navigate(action.path)}
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
                    title={dateRange === 'today' ? 'مبيعات اليوم' : dateRange === 'week' ? 'مبيعات الأسبوع' : 'مبيعات الشهر'}
                    value={`${stats?.sales?.total?.toLocaleString() || 0} ج.م`}
                    subValue={`${stats?.sales?.count || 0} عملية`}
                    icon={ShoppingCart}
                    color="from-green-500 to-emerald-600"
                    trend={dateRange === 'month' ? stats?.monthlyTrend : stats?.dailyTrend}
                    delay={0.1}
                />
                <StatCard
                    title="مبيعات الشهر"
                    value={`${stats?.monthSales?.total?.toLocaleString() || 0} ج.م`}
                    subValue={`${stats?.monthSales?.count || 0} عملية`}
                    icon={TrendingUp}
                    color="from-blue-500 to-indigo-600"
                    trend={stats?.monthlyTrend}
                    delay={0.2}
                />
                <StatCard
                    title="صافي الأرباح"
                    value={`${(stats?.monthlyProfit || 0).toLocaleString()} ج.م`}
                    subValue="بعد خصم المصروفات"
                    icon={DollarSign}
                    color="from-purple-500 to-pink-600"
                    delay={0.3}
                />
                <StatCard
                    title="مصروفات اليوم"
                    value={`${stats?.todayExpenses?.total?.toLocaleString() || 0} ج.م`}
                    icon={AlertTriangle}
                    color="from-red-500 to-orange-600"
                    trend={stats?.expenseTrend}
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
                    title="أجهزة الصيانة"
                    value={stats?.pendingMaintenance || 0}
                    subValue={`${stats?.overdue?.count || 0} قسط متأخر`}
                    icon={Wrench}
                    color="from-amber-500 to-yellow-600"
                    delay={0.6}
                />
                <StatCard
                    title="ديون العملاء"
                    value={`${(stats?.totalDebt || 0).toLocaleString()} ج.م`}
                    subValue={`${stats?.totalCustomers || 0} عميل`}
                    icon={Users}
                    color="from-rose-500 to-red-600"
                    delay={0.7}
                />
                <StatCard
                    title="مخزون منخفض"
                    value={stats?.lowStock || 0}
                    subValue={`${stats?.activeEmployees || 0} موظف نشط`}
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

                    {stats?.chartData?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            {chartType === 'sales' ? (
                                <BarChart data={stats.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}ك`} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value.toLocaleString()} ج.م`, 'القيمة']} />
                                    <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} name="المبيعات" />
                                    <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="المصروفات" />
                                </BarChart>
                            ) : chartType === 'profit' ? (
                                <LineChart data={stats.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}ك`} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value.toLocaleString()} ج.م`, 'الربح']} />
                                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} name="صافي الربح" />
                                </LineChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value.toLocaleString()} ج.م`, '']} />
                                    <Legend verticalAlign="bottom" height={36} formatter={(v) => <span className="text-dark-300 text-sm">{v}</span>} />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-dark-500">
                            لا توجد بيانات في هذه الفترة
                        </div>
                    )}
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
                            {alerts.map((alert, i) => (
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
                            <button
                                onClick={() => navigate('/inventory')}
                                className="text-primary-400 text-xs hover:text-primary-300 transition-colors"
                            >
                                عرض الكل ←
                            </button>
                        </div>
                        <div className="space-y-3">
                            {lowStockProducts.length === 0 ? (
                                <p className="text-dark-500 text-sm text-center py-4">لا توجد منتجات منخفضة المخزون 🎉</p>
                            ) : lowStockProducts.slice(0, 3).map((product, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-dark-800/50 rounded-lg">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-dark-200 truncate">{product.name}</p>
                                        <div className="w-full bg-dark-700 rounded-full h-1.5 mt-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all ${product.quantity <= 1 ? 'bg-red-500' :
                                                        product.quantity <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min((product.quantity / (product.alertQuantity || 1)) * 100, 100)}%` }}
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
                    <button
                        onClick={() => navigate('/sales')}
                        className="text-primary-400 text-sm hover:text-primary-300 transition-colors flex items-center gap-1"
                    >
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
                            {recentSales.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-dark-500">لا توجد مبيعات بعد</td>
                                </tr>
                            ) : recentSales.map((sale, i) => (
                                <motion.tr
                                    key={sale._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.05 }}
                                    className="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors"
                                >
                                    <td className="py-3 font-mono text-primary-400 text-sm">{sale.invoiceNumber}</td>
                                    <td className="py-3 text-dark-200 text-sm">{sale.customerName || sale.customer?.name || '-'}</td>
                                    <td className="py-3 font-semibold text-dark-100">{sale.total.toLocaleString()} ج.م</td>
                                    <td className="py-3">
                                        <span className="px-2.5 py-1 rounded-lg text-xs bg-dark-800 text-dark-300 border border-dark-700">
                                            {sale.methodLabel}
                                        </span>
                                    </td>
                                    <td className="py-3 text-dark-400 text-sm">{sale.timeLabel}</td>
                                    <td className="py-3">
                                        <button
                                            onClick={() => setSelectedSale(sale)}
                                            className="p-1.5 rounded-lg text-dark-400 hover:text-blue-400 hover:bg-dark-800 transition-colors"
                                            title="عرض التفاصيل"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Sale Details Modal */}
            <AnimatePresence>
                {selectedSale && (
                    <SaleDetailsModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function SaleDetailsModal({ sale, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-dark-800 flex items-center justify-between sticky top-0 bg-dark-900/95 backdrop-blur z-10">
                    <h2 className="text-xl font-bold text-dark-100">🧾 تفاصيل الفاتورة</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-dark-800/50 rounded-xl">
                            <p className="text-xs text-dark-500">رقم الفاتورة</p>
                            <p className="font-mono text-primary-400 text-sm mt-1">{sale.invoiceNumber}</p>
                        </div>
                        <div className="p-3 bg-dark-800/50 rounded-xl">
                            <p className="text-xs text-dark-500">العميل</p>
                            <p className="text-dark-200 text-sm mt-1">{sale.customerName || sale.customer?.name || '-'}</p>
                        </div>
                        <div className="p-3 bg-dark-800/50 rounded-xl">
                            <p className="text-xs text-dark-500">طريقة الدفع</p>
                            <p className="text-dark-200 text-sm mt-1">{sale.methodLabel}</p>
                        </div>
                        <div className="p-3 bg-dark-800/50 rounded-xl">
                            <p className="text-xs text-dark-500">التاريخ</p>
                            <p className="text-dark-200 text-sm mt-1">{new Date(sale.date).toLocaleString('ar-EG')}</p>
                        </div>
                    </div>

                    <div className="border-t border-dark-800 pt-4">
                        <h3 className="text-sm font-semibold text-dark-300 mb-3">المنتجات</h3>
                        <div className="space-y-2">
                            {(sale.items || []).map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-dark-800/50 rounded-lg text-sm">
                                    <span className="text-dark-200">{item.name} × {item.quantity}</span>
                                    <span className="text-dark-400">{(item.unitPrice * item.quantity).toLocaleString()} ج.م</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-dark-800 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-dark-400">المجموع</span>
                            <span className="text-dark-200">{(sale.subtotal || 0).toLocaleString()} ج.م</span>
                        </div>
                        {sale.discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400">الخصم</span>
                                <span className="text-red-400">- {sale.discount.toLocaleString()} ج.م</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark-800">
                            <span className="text-dark-200">الإجمالي</span>
                            <span className="text-primary-400">{sale.total.toLocaleString()} ج.م</span>
                        </div>
                        {sale.remaining > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400">المتبقي</span>
                                <span className="text-red-400">{sale.remaining.toLocaleString()} ج.م</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="w-full py-2.5 rounded-xl bg-primary-500/15 text-primary-400 hover:bg-primary-500/25 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                        <Printer size={16} /> طباعة الفاتورة
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}