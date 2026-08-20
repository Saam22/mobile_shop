import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Phone, MapPin, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/customers');
            setCustomers(data);
        } catch (err) {
            toast.error('فشل تحميل العملاء');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (customer) => {
        try {
            const { data } = await api.post('/customers', customer);
            setCustomers([data, ...customers]);
            setShowAddModal(false);
            toast.success('تم إضافة العميل بنجاح');
        } catch (err) {
            toast.error(err.response?.data?.error || 'فشل إضافة العميل');
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.includes(searchQuery) || c.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">👥 إدارة العملاء</h1>
                    <p className="text-dark-400 text-sm mt-1">إدارة بيانات العملاء ومتابعة مشترياتهم</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    إضافة عميل
                </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث بالاسم أو رقم الهاتف..."
                    className="input-dark w-full pr-10 pl-4 py-2.5 rounded-xl"
                />
            </div>

            {/* Customers Grid */}
            {loading ? (
                <div className="text-center py-20 text-dark-400">جاري التحميل...</div>
            ) : customers.length === 0 ? (
                <div className="text-center py-20 text-dark-400">لا يوجد عملاء - اضغط "إضافة عميل"</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer, i) => (
                    <motion.div
                        key={customer._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="glass rounded-2xl p-5 card-hover"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                                {customer.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-dark-100">{customer.name}</h3>
                                <p className="text-dark-400 text-sm flex items-center gap-1">
                                    <Phone size={12} /> {customer.phone}
                                </p>
                                {customer.address && (
                                    <p className="text-dark-500 text-xs flex items-center gap-1 mt-1">
                                        <MapPin size={12} /> {customer.address}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="p-2 bg-dark-800/50 rounded-lg">
                                <p className="text-xs text-dark-500">إجمالي المشتريات</p>
                                <p className="text-sm font-semibold text-green-400">{customer.totalPurchases.toLocaleString()} ج.م</p>
                            </div>
                            <div className="p-2 bg-dark-800/50 rounded-lg">
                                <p className="text-xs text-dark-500">المديونية</p>
                                <p className={`text-sm font-semibold ${customer.totalDebt > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {customer.totalDebt > 0 ? `${customer.totalDebt.toLocaleString()} ج.م` : 'لا يوجد'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedCustomer(customer)}
                                className="flex-1 py-2 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 text-sm flex items-center justify-center gap-1 transition-colors"
                            >
                                <Eye size={14} /> التفاصيل
                            </button>
                            <a
                                href={`tel:${customer.phone}`}
                                className="py-2 px-3 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 text-sm flex items-center justify-center transition-colors"
                            >
                                <Phone size={14} />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
            )}

            {/* Customer Details Modal */}
            <AnimatePresence>
                {selectedCustomer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedCustomer(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="glass rounded-2xl w-full max-w-lg p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-dark-100">📋 تفاصيل العميل</h2>
                                <button onClick={() => setSelectedCustomer(null)} className="text-dark-400 hover:text-white">✕</button>
                            </div>

                            <div className="space-y-3">
                                <DetailRow label="الاسم" value={selectedCustomer.name} />
                                <DetailRow label="الهاتف" value={selectedCustomer.phone} />
                                <DetailRow label="العنوان" value={selectedCustomer.address} />
                                <DetailRow label="الرقم القومي" value={selectedCustomer.nationalId} />
                                <DetailRow label="إجمالي المشتريات" value={`${selectedCustomer.totalPurchases.toLocaleString()} ج.م`} />
                                <DetailRow label="المديونية" value={selectedCustomer.totalDebt > 0 ? `${selectedCustomer.totalDebt.toLocaleString()} ج.م` : 'لا يوجد'} />
                                <DetailRow label="ملاحظات" value={selectedCustomer.notes} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Customer Modal */}
            <AnimatePresence>
                {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
            </AnimatePresence>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-dark-800/50">
            <span className="text-dark-400 text-sm">{label}</span>
            <span className="text-dark-200 font-medium">{value || '-'}</span>
        </div>
    );
}

function AddCustomerModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ name: '', phone: '', address: '', nationalId: '', notes: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(form);
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
                    <h2 className="text-xl font-bold text-dark-100">➕ إضافة عميل جديد</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">الاسم *</label>
                        <input required className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">رقم الهاتف *</label>
                        <input required className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">العنوان</label>
                        <input className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-1">الرقم القومي</label>
                        <input className="input-dark w-full px-3 py-2 rounded-lg"
                            value={form.nationalId} onChange={e => setForm({ ...form, nationalId: e.target.value })} />
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