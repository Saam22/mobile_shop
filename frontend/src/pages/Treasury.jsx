import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const walletTypes = [
    { id: 'vodafone_cash', name: 'فودافون كاش', icon: '📱', color: 'from-red-500 to-rose-600' },
    { id: 'etisalat_cash', name: 'اتصالات كاش', icon: '📱', color: 'from-orange-500 to-amber-600' },
    { id: 'we_pay', name: 'WE Pay', icon: '🌐', color: 'from-blue-500 to-cyan-600' },
    { id: 'instapay', name: 'إنستا باي', icon: '💳', color: 'from-purple-500 to-violet-600' },
    { id: 'bank', name: 'حساب بنكي', icon: '🏦', color: 'from-indigo-500 to-blue-600' },
];

const typeLabels = {
    deposit: 'إيداع',
    withdraw: 'سحب',
    transfer: 'تحويل',
    receive: 'استلام',
};

export default function Treasury() {
    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [activeTab, setActiveTab] = useState('wallets');

    useEffect(() => {
        loadWallets();
    }, []);

    const loadWallets = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/treasury/wallets');
            setWallets(data);
            const allTx = data.flatMap(w =>
                (w.transactions || []).map(tx => ({ ...tx, wallet: w }))
            ).sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(allTx);
        } catch (err) {
            toast.error('فشل تحميل المحافظ');
        } finally {
            setLoading(false);
        }
    };

    const handleTransaction = async (walletId, tx) => {
        try {
            const { data } = await api.post(`/treasury/wallets/${walletId}/transaction`, tx);
            setWallets(wallets.map(w => w._id === walletId ? data : w));
            const allTx = wallets.map(w => w._id === walletId ? data : w)
                .flatMap(w => (w.transactions || []).map(t => ({ ...t, wallet: w })))
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(allTx);
            setShowTransactionModal(false);
            toast.success('تم تسجيل العملية بنجاح');
        } catch (err) {
            toast.error(err.response?.data?.error || 'فشل تسجيل العملية');
        }
    };

    const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">💰 الخزينة والمحافظ</h1>
                    <p className="text-dark-400 text-sm mt-1">إدارة جميع المحافظ والحسابات البنكية</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTransactionModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    عملية جديدة
                </motion.button>
            </div>

            {/* Total Balance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 bg-gradient-to-br from-primary-500/10 to-purple-500/10"
            >
                <p className="text-dark-400 text-sm">إجمالي الأرصدة</p>
                <p className="text-4xl font-bold gradient-text mt-1">{totalBalance.toLocaleString()} ج.م</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('wallets')}
                    className={`px-4 py-2 rounded-xl text-sm ${activeTab === 'wallets' ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-800 text-dark-400'}`}
                >
                    المحافظ
                </button>
                <button
                    onClick={() => setActiveTab('transactions')}
                    className={`px-4 py-2 rounded-xl text-sm ${activeTab === 'transactions' ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-800 text-dark-400'}`}
                >
                    الحركات
                </button>
            </div>

            {activeTab === 'wallets' ? (
                loading ? (
                    <div className="text-center py-20 text-dark-400">جاري التحميل...</div>
                ) : wallets.length === 0 ? (
                    <div className="text-center py-20 text-dark-400">لا توجد محافظ</div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallets.map((wallet, i) => (
                        <motion.div
                            key={wallet._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="glass rounded-2xl p-5 card-hover"
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${walletTypes.find(t => t.id === wallet.type)?.color || 'from-gray-500 to-slate-600'} flex items-center justify-center text-2xl`}>
                                    {walletTypes.find(t => t.id === wallet.type)?.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-dark-100">{wallet.name}</h3>
                                    {wallet.number && <p className="text-dark-400 text-xs font-mono">{wallet.number}</p>}
                                </div>
                            </div>

                            <p className="text-2xl font-bold text-dark-100">{(wallet.balance || 0).toLocaleString()} ج.م</p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleTransaction(wallet._id, { type: 'deposit', amount: prompt('المبلغ:') || 0, fee: 0, notes: 'إيداع' })}
                                    className="flex-1 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-sm hover:bg-green-500/25 transition-colors flex items-center justify-center gap-1"
                                >
                                    <ArrowUpRight size={14} /> إيداع
                                </button>
                                <button
                                    onClick={() => handleTransaction(wallet._id, { type: 'withdraw', amount: prompt('المبلغ:') || 0, fee: 0, notes: 'سحب' })}
                                    className="flex-1 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition-colors flex items-center justify-center gap-1"
                                >
                                    <ArrowDownLeft size={14} /> سحب
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                )
            ) : (
                <div className="glass rounded-2xl p-5 table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>المحفظة</th>
                                <th>النوع</th>
                                <th>المبلغ</th>
                                <th>العمولة</th>
                                <th>التاريخ</th>
                                <th>ملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-dark-400">لا توجد حركات</td></tr>
                            ) : transactions.map(tx => (
                                <tr key={tx._id}>
                                    <td>{tx.wallet?.name}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-lg text-xs ${tx.type === 'deposit' ? 'bg-green-500/15 text-green-400' :
                                                tx.type === 'withdraw' ? 'bg-red-500/15 text-red-400' :
                                                    tx.type === 'transfer' ? 'bg-blue-500/15 text-blue-400' :
                                                        'bg-purple-500/15 text-purple-400'
                                            }`}>
                                            {typeLabels[tx.type] || tx.type}
                                        </span>
                                    </td>
                                    <td className="font-semibold">{tx.amount.toLocaleString()} ج.م</td>
                                    <td className="text-dark-400">{tx.fee > 0 ? `${tx.fee} ج.م` : '-'}</td>
                                    <td className="text-dark-400 text-sm">{new Date(tx.date).toLocaleDateString('ar-EG')}</td>
                                    <td className="text-dark-400 text-sm">{tx.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Transaction Modal */}
            <AnimatePresence>
                {showTransactionModal && <TransactionModal wallets={wallets} onClose={() => setShowTransactionModal(false)} onAdd={handleTransaction} />}
            </AnimatePresence>
        </div>
    );
}

function TransactionModal({ wallets, onClose, onAdd }) {
    const [form, setForm] = useState({
        wallet: '', type: 'deposit', amount: '', fee: '', notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(form.wallet, {
            type: form.type,
            amount: Number(form.amount),
            fee: Number(form.fee) || 0,
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
                    <h2 className="text-xl font-bold text-dark-100">💰 عملية جديدة</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">المحفظة *</label>
                        <select required className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.wallet} onChange={e => setForm({ ...form, wallet: e.target.value })}>
                            <option value="">اختر المحفظة</option>
                            {wallets.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">نوع العملية *</label>
                        <select required className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="deposit">إيداع</option>
                            <option value="withdraw">سحب</option>
                            <option value="transfer">تحويل</option>
                            <option value="receive">استلام</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">المبلغ *</label>
                        <input type="number" required className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">العمولة</label>
                        <input type="number" className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} />
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