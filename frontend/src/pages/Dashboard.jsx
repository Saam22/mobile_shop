import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingCart, TrendingUp, Package, Wrench,
    AlertTriangle, Users, DollarSign, Clock
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const sampleData = [
    { name: 'السبت', sales: 12000, expenses: 3000 },
    { name: 'الأحد', sales: 15000, expenses: 2500 },
    { name: 'الإثنين', sales: 8000, expenses: 4000 },
    { name: 'الثلاثاء', sales: 22000, expenses: 3500 },
    { name: 'الأربعاء', sales: 18000, expenses: 2000 },
    { name: 'الخميس', sales: 25000, expenses: 5000 },
    { name: 'الجمعة', sales: 20000, expenses: 1500 },
];

const recentSales = [
    { id: 'INV-001234', customer: 'أحمد محمد', amount: 15500, method: 'نقدي', time: '10:30 ص' },
    { id: 'INV-001233', customer: 'سارة علي', amount: 850, method: 'فودافون كاش', time: '09:45 ص' },
    { id: 'INV-001232', customer: 'محمود حسن', amount: 3200, method: 'إنستا باي', time: '09:15 ص' },
    { id: 'INV-001231', customer: 'فاطمة أحمد', amount: 12000, method: 'أقساط', time: '08:30 ص' },
];

const alerts = [
    { type: 'danger', text: 'قسط متأخر - محمد عبدالله (1,500 ج.م)', time: 'منذ يومين' },
    { type: 'warning', text: 'منتج قارب على النفاد - iPhone 15 Pro (2 قطعة)', time: 'منذ 3 ساعات' },
    { type: 'info', text: 'جهاز صيانة جديد - Samsung A54', time: 'منذ ساعة' },
];

export default function Dashboard() {
    const [stats, setStats] = useState({
        dailySales: { total: 45200, count: 12 },
        monthlySales: { total: 385000, count: 89 },
        totalProducts: 456,
        pendingMaintenance: 8,
        dailyExpenses: { total: 2800 },
        lowStock: 15,
        totalDebt: 28500,
        monthlyProfit: 125000,
    });

    return (
        <div className="space-y-6 page-enter">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/5 to-purple-500/5"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-dark-100">
                        مرحباً بك 👋
                    </h1>
                    <p className="text-dark-400 mt-1">إليك ملخص أداء المتجر اليوم</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="مبيعات اليوم"
                    value={`${stats.dailySales.total.toLocaleString()} ج.م`}
                    icon={ShoppingCart}
                    color="from-green-500 to-emerald-600"
                    trend={12}
                    delay={0.1}
                />
                <StatCard
                    title="مبيعات الشهر"
                    value={`${stats.monthlySales.total.toLocaleString()} ج.م`}
                    icon={TrendingUp}
                    color="from-blue-500 to-indigo-600"
                    trend={8}
                    delay={0.2}
                />
                <StatCard
                    title="الأرباح الشهرية"
                    value={`${stats.monthlyProfit.toLocaleString()} ج.م`}
                    icon={DollarSign}
                    color="from-purple-500 to-pink-600"
                    trend={15}
                    delay={0.3}
                />
                <StatCard
                    title="مصروفات اليوم"
                    value={`${stats.dailyExpenses.total.toLocaleString()} ج.م`}
                    icon={AlertTriangle}
                    color="from-red-500 to-orange-600"
                    trend={-5}
                    delay={0.4}
                />
                <StatCard
                    title="إجمالي المنتجات"
                    value={stats.totalProducts}
                    icon={Package}
                    color="from-cyan-500 to-blue-600"
                    delay={0.5}
                />
                <StatCard
                    title="أجهزة الصيانة"
                    value={stats.pendingMaintenance}
                    icon={Wrench}
                    color="from-amber-500 to-yellow-600"
                    delay={0.6}
                />
                <StatCard
                    title="الديون المستحقة"
                    value={`${stats.totalDebt.toLocaleString()} ج.م`}
                    icon={Users}
                    color="from-rose-500 to-red-600"
                    delay={0.7}
                />
                <StatCard
                    title="منتجات قليلة الكمية"
                    value={stats.lowStock}
                    icon={Clock}
                    color="from-orange-500 to-red-600"
                    delay={0.8}
                />
            </div>

            {/* Charts & Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 glass rounded-2xl p-5"
                >
                    <h3 className="text-lg font-semibold text-dark-200 mb-4">مخطط المبيعات الأسبوعي</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={sampleData}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    background: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '0.5rem',
                                    color: '#e2e8f0',
                                    fontFamily: 'Cairo',
                                }}
                            />
                            <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} name="المبيعات" />
                            <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="المصروفات" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-2xl p-5"
                >
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
                </motion.div>
            </div>

            {/* Recent Sales */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-2xl p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-dark-200">📋 آخر المبيعات</h3>
                    <button className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
                        عرض الكل ←
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>العميل</th>
                                <th>المبلغ</th>
                                <th>طريقة الدفع</th>
                                <th>الوقت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentSales.map((sale) => (
                                <tr key={sale.id}>
                                    <td className="font-mono text-primary-400">{sale.id}</td>
                                    <td>{sale.customer}</td>
                                    <td className="font-semibold">{sale.amount.toLocaleString()} ج.م</td>
                                    <td>
                                        <span className="px-2 py-1 rounded-lg text-xs bg-dark-800 text-dark-300">
                                            {sale.method}
                                        </span>
                                    </td>
                                    <td className="text-dark-400 text-sm">{sale.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}