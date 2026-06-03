import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Printer, FileText } from 'lucide-react';

const monthlyData = [
    { month: 'يناير', sales: 285000, expenses: 18000, profit: 95000 },
    { month: 'فبراير', sales: 320000, expenses: 22000, profit: 105000 },
    { month: 'مارس', sales: 295000, expenses: 19000, profit: 98000 },
    { month: 'أبريل', sales: 380000, expenses: 25000, profit: 135000 },
    { month: 'مايو', sales: 410000, expenses: 28000, profit: 152000 },
    { month: 'يونيو', sales: 365000, expenses: 21000, profit: 118000 },
];

const categoryData = [
    { name: 'موبايلات جديدة', value: 45, color: '#3b82f6' },
    { name: 'موبايلات مستعملة', value: 15, color: '#f59e0b' },
    { name: 'إكسسوارات', value: 25, color: '#8b5cf6' },
    { name: 'شواحن ووصلات', value: 10, color: '#22c55e' },
    { name: 'صيانة', value: 5, color: '#ef4444' },
];

const reportTypes = [
    { id: 'daily', name: 'المبيعات اليومية' },
    { id: 'monthly', name: 'المبيعات الشهرية' },
    { id: 'profits', name: 'الأرباح' },
    { id: 'expenses', name: 'المصروفات' },
    { id: 'maintenance', name: 'الصيانة' },
    { id: 'inventory', name: 'المخزون' },
    { id: 'customers', name: 'العملاء' },
    { id: 'installments', name: 'الأقساط' },
    { id: 'wallets', name: 'المحافظ' },
];

export default function Reports() {
    const [selectedReport, setSelectedReport] = useState('monthly');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">📈 التقارير</h1>
                    <p className="text-dark-400 text-sm mt-1">تقارير شاملة عن أداء المتجر</p>
                </div>
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl bg-dark-800 text-dark-300 text-sm flex items-center gap-2 hover:bg-dark-700 transition-colors"
                    >
                        <Printer size={16} /> طباعة
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl bg-dark-800 text-dark-300 text-sm flex items-center gap-2 hover:bg-dark-700 transition-colors"
                    >
                        <Download size={16} /> تصدير
                    </motion.button>
                </div>
            </div>

            {/* Report Types */}
            <div className="glass rounded-2xl p-4">
                <div className="flex flex-wrap gap-2">
                    {reportTypes.map(report => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedReport === report.id
                                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                    : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                                }`}
                        >
                            {report.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-3">
                <input
                    type="date"
                    className="input-dark px-3 py-2 rounded-lg text-sm"
                    value={dateRange.from}
                    onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
                />
                <span className="text-dark-400">إلى</span>
                <input
                    type="date"
                    className="input-dark px-3 py-2 rounded-lg text-sm"
                    value={dateRange.to}
                    onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
                />
                <button className="btn-primary px-4 py-2 rounded-lg text-sm">تطبيق</button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Sales Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-5"
                >
                    <h3 className="text-lg font-semibold text-dark-200 mb-4">المبيعات والأرباح الشهرية</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
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
                            <Bar dataKey="profit" fill="#22c55e" radius={[6, 6, 0, 0]} name="الأرباح" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Category Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-5"
                >
                    <h3 className="text-lg font-semibold text-dark-200 mb-4">توزيع المبيعات حسب التصنيف</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '0.5rem',
                                    color: '#e2e8f0',
                                    fontFamily: 'Cairo',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'إجمالي المبيعات', value: '2,055,000 ج.م', color: 'text-blue-400' },
                    { label: 'إجمالي الأرباح', value: '703,000 ج.م', color: 'text-green-400' },
                    { label: 'إجمالي المصروفات', value: '133,000 ج.م', color: 'text-red-400' },
                    { label: 'صافي الربح', value: '570,000 ج.م', color: 'text-purple-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="glass rounded-2xl p-4"
                    >
                        <p className="text-dark-400 text-sm">{stat.label}</p>
                        <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}