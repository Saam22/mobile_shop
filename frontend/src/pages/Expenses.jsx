import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const expenseCategories = [
    { id: 'electricity', name: 'كهرباء', icon: '⚡', color: 'from-yellow-500 to-amber-600' },
    { id: 'water', name: 'مياه', icon: '💧', color: 'from-blue-500 to-cyan-600' },
    { id: 'internet', name: 'إنترنت', icon: '🌐', color: 'from-green-500 to-emerald-600' },
    { id: 'rent', name: 'إيجار', icon: '🏠', color: 'from-purple-500 to-violet-600' },
    { id: 'salaries', name: 'مرتبات', icon: '💰', color: 'from-orange-500 to-red-600' },
    { id: 'transport', name: 'مواصلات', icon: '🚗', color: 'from-gray-500 to-slate-600' },
    { id: 'shop_maintenance', name: 'صيانة المحل', icon: '🔧', color: 'from-teal-500 to-green-600' },
    { id: 'cleaning', name: 'نظافة', icon: '🧹', color: 'from-pink-500 to-rose-600' },
    { id: 'taxes', name: 'ضرائب', icon: '📋', color: 'from-indigo-500 to-blue-600' },
    { id: 'other', name: 'أخرى', icon: '📦', color: 'from-gray-500 to-zinc-600' },
];

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/expenses');
            setExpenses(data);
        } catch (err) {
            toast.error('فشل تحميل المصروفات');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (expense) => {
        try {
            const { data } = await api.post('/expenses', expense);
            setExpenses([data, ...expenses]);
            setShowAddModal(false);
            toast.success('تم إضافة المصروف بنجاح');
        } catch (err) {
            toast.error(err.response?.data?.error || 'فشل إضافة المصروف');
        }
    };

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const filteredExpenses = expenses.filter(e =>
        expenseCategories.find(c => c.id === e.category)?.name.includes(searchQuery) ||
        e.notes?.includes(searchQuery)
    );

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">📊 المصروفات</h1>
                    <p className="text-dark-400 text-sm mt-1">تسجيل ومتابعة جميع المصروفات</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    إضافة مصروف
                </motion.button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-5"
                >
                    <p className="text-dark-400 text-sm">إجمالي المصروفات</p>
                    <p className="text-2xl font-bold text-red-400 mt-1">{totalExpenses.toLocaleString()} ج.م</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-2xl p-5"
                >
                    <p className="text-dark-400 text-sm">عدد العمليات</p>
                    <p className="text-2xl font-bold text-dark-100 mt-1">{expenses.length}</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-2xl p-5"
                >
                    <p className="text-dark-400 text-sm">متوسط المصروف</p>
                    <p className="text-2xl font-bold text-dark-100 mt-1">
                        {expenses.length > 0 ? Math.round(totalExpenses / expenses.length).toLocaleString() : 0} ج.م
                    </p>
                </motion.div>
            </div>

            {/* Categories */}
            <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-dark-300 mb-3">توزيع المصروفات حسب التصنيف</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {expenseCategories.map(cat => {
                        const catTotal = expenses.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0);
                        if (catTotal === 0) return null;
                        return (
                            <div key={cat.id} className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} bg-opacity-10`}>
                                <span className="text-2xl">{cat.icon}</span>
                                <p className="text-sm text-white/80 mt-1">{cat.name}</p>
                                <p className="text-lg font-bold text-white">{catTotal.toLocaleString()} ج.م</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Expenses Table */}
            <div className="glass rounded-2xl p-5 table-container">
                <table>
                    <thead>
                        <tr>
                            <th>التصنيف</th>
                            <th>المبلغ</th>
                            <th>التاريخ</th>
                            <th>ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-10 text-dark-400">جاري التحميل...</td></tr>
                        ) : filteredExpenses.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-10 text-dark-400">لا توجد مصروفات</td></tr>
                        ) : filteredExpenses.map(exp => (
                            <tr key={exp._id}>
                                <td>
                                    <span className="flex items-center gap-2">
                                        <span>{expenseCategories.find(c => c.id === exp.category)?.icon}</span>
                                        {expenseCategories.find(c => c.id === exp.category)?.name}
                                    </span>
                                </td>
                                <td className="text-red-400 font-semibold">{exp.amount.toLocaleString()} ج.م</td>
                                <td className="text-dark-400 text-sm">{new Date(exp.date).toLocaleDateString('ar-EG')}</td>
                                <td className="text-dark-400 text-sm">{exp.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Expense Modal */}
            <AnimatePresence>
                {showAddModal && <AddExpenseModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
            </AnimatePresence>
        </div>
    );
}

function AddExpenseModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ category: 'other', amount: '', date: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            category: form.category,
            amount: Number(form.amount),
            date: form.date ? new Date(form.date) : new Date(),
            notes: form.notes,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="glass rounded-2xl w-full max-w-lg p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-dark-100">➕ إضافة مصروف</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">التصنيف *</label>
                        <select required className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            {expenseCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">المبلغ *</label>
                        <input type="number" required className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">التاريخ</label>
                        <input type="date" className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">ملاحظات</label>
                        <textarea className="input-dark w-full px-3 py-2 rounded-lg h-16"
                            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-success flex-1 py-2.5 rounded-xl font-semibold">حفظ</button>
                        <button type="button" onClick={onClose} className="btn-danger px-6 py-2.5 rounded-xl font-semibold">إلغاء</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}