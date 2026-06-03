import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const walletTypes = [
    { id: 'cash', name: 'نقدية', icon: '💵', color: 'from-green-500 to-emerald-600' },
    { id: 'vodafone_cash', name: 'فودافون كاش', icon: '📱', color: 'from-red-500 to-rose-600' },
    { id: 'etisalat_cash', name: 'اتصالات كاش', icon: '📱', color: 'from-orange-500 to-amber-600' },
    { id: 'we_pay', name: 'WE Pay', icon: '🌐', color: 'from-blue-500 to-cyan-600' },
    { id: 'instapay', name: 'إنستا باي', icon: '💳', color: 'from-purple-500 to-violet-600' },
    { id: 'bank', name: 'حساب بنكي', icon: '🏦', color: 'from-indigo-500 to-blue-600' },
];

const sampleWallets = [
    { id: 1, name: 'خزينة المحل', type: 'cash', number: '', balance: 125000 },
    { id: 2, name: 'فودافون كاش - رئيسي', type: 'vodafone_cash', number: '01012345678', balance: 45000 },
    { id: 3, name: 'WE Pay', type: 'we_pay', number: '01098765432', balance: 18500 },
    { id: 4, name: 'إنستا باي', type: 'instapay', number: '01234567890', balance: 32000 },
    { id: 5, name: 'بنك الأهلي', type: 'bank', number: '1234567890123456', balance: 250000 },
];

const sampleTransactions = [
    { id: 1, walletId: 1, type: 'deposit', amount: 50000, fee: 0, date: '2024-01-15 10:30', notes: 'إيراد مبيعات' },
    { id: 2, walletId: 2, type: 'withdraw', amount: 5000, fee: 15, date: '2024-01-15 09:00', notes: 'سحب للمصروفات' },
    { id: 3, walletId: 3, type: 'receive', amount: 12000, fee: 0, date: '2024-01-14 16:00', notes: 'تحويل من عميل' },
    { id: 4, walletId: 1, type: 'transfer', amount: 20000, fee: 0, date: '2024-01-14 14:00', notes: 'تحويل لبنك الأهلي' },
];

export default function Treasury() {
    const [wallets, setWallets] = useState(sampleWallets);
    const [transactions, setTransactions] = useState(sampleTransactions);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [activeTab, setActiveTab] = useState('wallets');

    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallets.map((wallet, i) => (
                        <motion.div
                            key={wallet.id}
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

                            <p className="text-2xl font-bold text-dark-100">{wallet.balance.toLocaleString()} ج.م</p>

                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-sm hover:bg-green-500/25 transition-colors flex items-center justify-center gap-1">
                                    <ArrowUpRight size={14} /> إيداع
                                </button>
                                <button className="flex-1 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition-colors flex items-center justify-center gap-1">
                                    <ArrowDownLeft size={14} /> سحب
                                </button>
                                <button className="py-1.5 px-3 rounded-lg bg-blue-500/15 text-blue-400 text-sm hover:bg-blue-500/25 transition-colors flex items-center justify-center gap-1">
                                    <ArrowLeftRight size={14} /> تحويل
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
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
                            {transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{wallets.find(w => w.id === tx.walletId)?.name}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-lg text-xs ${tx.type === 'deposit' ? 'bg-green-500/15 text-green-400' :
                                                tx.type === 'withdraw' ? 'bg-red-500/15 text-red-400' :
                                                    tx.type === 'transfer' ? 'bg-blue-500/15 text-blue-400' :
                                                        'bg-purple-500/15 text-purple-400'
                                            }`}>
                                            {tx.type === 'deposit' ? 'إيداع' : tx.type === 'withdraw' ? 'سحب' : tx.type === 'transfer' ? 'تحويل' : 'استلام'}
                                        </span>
                                    </td>
                                    <td className="font-semibold">{tx.amount.toLocaleString()} ج.م</td>
                                    <td className="text-dark-400">{tx.fee > 0 ? `${tx.fee} ج.م` : '-'}</td>
                                    <td className="text-dark-400 text-sm">{tx.date}</td>
                                    <td className="text-dark-400 text-sm">{tx.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Transaction Modal */}
            <AnimatePresence>
                {showTransactionModal && <TransactionModal onClose={() => setShowTransactionModal(false)} />}
            </AnimatePresence>
        </div>
    );
}

function TransactionModal({ onClose }) {
    const [form, setForm] = useState({
        wallet: '', type: 'deposit', amount: '', fee: '', notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('تم تسجيل العملية بنجاح');
        onClose();
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
                            {walletTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
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