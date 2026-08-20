import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Printer, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const statusSteps = [
    { id: 'new', label: 'تم الاستلام', color: 'bg-blue-500' },
    { id: 'checking', label: 'جاري الفحص', color: 'bg-yellow-500' },
    { id: 'repairing', label: 'جاري الإصلاح', color: 'bg-orange-500' },
    { id: 'waiting_parts', label: 'انتظار قطع غيار', color: 'bg-purple-500' },
    { id: 'repaired', label: 'تم الإصلاح', color: 'bg-green-500' },
    { id: 'delivered', label: 'تم التسليم', color: 'bg-gray-500' },
];

export default function Maintenance() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/maintenance');
            setTickets(data);
        } catch (err) {
            toast.error('فشل تحميل تذاكر الصيانة');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (ticket) => {
        try {
            const { data } = await api.post('/maintenance', ticket);
            setTickets([data, ...tickets]);
            setShowAddModal(false);
            toast.success('تم تسجيل جهاز الصيانة بنجاح');
        } catch (err) {
            toast.error(err.response?.data?.error || 'فشل تسجيل الجهاز');
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.customerName.includes(searchQuery) ||
            t.customerPhone.includes(searchQuery) ||
            t.ticketNumber.includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const updateStatus = async (id, newStatus) => {
        try {
            const { data } = await api.patch(`/maintenance/${id}/status`, { status: newStatus });
            setTickets(tickets.map(t => t._id === id ? data : t));
            toast.success('تم تحديث الحالة');
        } catch (err) {
            toast.error('فشل تحديث الحالة');
        }
    };

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">🔧 قسم الصيانة</h1>
                    <p className="text-dark-400 text-sm mt-1">متابعة أجهزة الصيانة وحالاتها</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    تسجيل جهاز جديد
                </motion.button>
            </div>

            {/* Status Filter */}
            <div className="glass rounded-2xl p-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-xl text-sm ${filterStatus === 'all' ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-800 text-dark-400'
                            }`}
                    >
                        الكل ({tickets.length})
                    </button>
                    {statusSteps.map(step => {
                        const count = tickets.filter(t => t.status === step.id).length;
                        return (
                            <button
                                key={step.id}
                                onClick={() => setFilterStatus(step.id)}
                                className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${filterStatus === step.id ? 'bg-primary-500/20 text-primary-400' : 'bg-dark-800 text-dark-400'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${step.color}`}></span>
                                {step.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث باسم العميل، رقم الهاتف، رقم التذكرة..."
                    className="input-dark w-full pr-10 pl-4 py-2.5 rounded-xl"
                />
            </div>

            {/* Tickets */}
            {loading ? (
                <div className="text-center py-20 text-dark-400">جاري التحميل...</div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-20 text-dark-400">لا توجد تذاكر صيانة - اضغط "تسجيل جهاز جديد"</div>
            ) : (
            <div className="space-y-4">
                {filteredTickets.map((ticket, i) => (
                    <motion.div
                        key={ticket._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-2xl p-5 card-hover"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">📱</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-primary-400 text-sm">{ticket.ticketNumber}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs text-white ${statusSteps.find(s => s.id === ticket.status)?.color}`}>
                                            {statusSteps.find(s => s.id === ticket.status)?.label}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-dark-100">{ticket.customerName}</h3>
                                    <p className="text-dark-400 text-sm">{ticket.customerPhone}</p>
                                    <p className="text-dark-300 text-sm mt-1">
                                        {ticket.brand} {ticket.model} - {ticket.problem}
                                    </p>
                                    <p className="text-dark-500 text-xs mt-1">الفني: {ticket.technician} | التكلفة: {ticket.cost} ج.م | السعر: {ticket.sellingPrice} ج.م</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {/* Status Progress */}
                                <select
                                    value={ticket.status}
                                    onChange={e => updateStatus(ticket._id, e.target.value)}
                                    className="input-dark px-3 py-2 rounded-lg text-sm"
                                >
                                    {statusSteps.map(step => (
                                        <option key={step.id} value={step.id}>{step.label}</option>
                                    ))}
                                </select>

                                <button className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-blue-400 transition-colors">
                                    <Printer size={16} />
                                </button>
                                <button className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-yellow-400 transition-colors">
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Status Progress Bar */}
                        <div className="mt-4 flex items-center gap-1">
                            {statusSteps.map((step, idx) => {
                                const currentIndex = statusSteps.findIndex(s => s.id === ticket.status);
                                const isActive = idx <= currentIndex;
                                return (
                                    <React.Fragment key={step.id}>
                                        <div className={`flex-1 h-1.5 rounded-full transition-all ${isActive ? step.color : 'bg-dark-800'
                                            }`} />
                                        {idx < statusSteps.length - 1 && <div className="w-1" />}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
            )}

            {/* Add Maintenance Modal */}
            <AnimatePresence>
                {showAddModal && <AddMaintenanceModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
            </AnimatePresence>
        </div>
    );
}

function AddMaintenanceModal({ onClose, onAdd }) {
    const [form, setForm] = useState({
        customerName: '', customerPhone: '', deviceType: 'موبايل',
        brand: '', model: '', problem: '', password: '', notes: '',
        technician: '', cost: '', sellingPrice: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            customerName: form.customerName,
            customerPhone: form.customerPhone,
            deviceType: form.deviceType,
            brand: form.brand,
            model: form.model,
            problem: form.problem,
            password: form.password,
            customerNotes: form.notes,
            notes: form.notes,
            technician: form.technician,
            cost: Number(form.cost) || 0,
            sellingPrice: Number(form.sellingPrice) || 0,
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
                className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-dark-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark-100">🔧 تسجيل جهاز صيانة جديد</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">اسم العميل *</label>
                            <input required className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">رقم الهاتف *</label>
                            <input required className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">نوع الجهاز</label>
                            <select className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.deviceType} onChange={e => setForm({ ...form, deviceType: e.target.value })}>
                                <option>موبايل</option>
                                <option>تابلت</option>
                                <option>لابتوب</option>
                                <option>ساعة ذكية</option>
                                <option>أخرى</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">الشركة</label>
                            <input className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">الموديل</label>
                            <input className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">كلمة السر</label>
                            <input className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-dark-300 text-sm mb-1">العطل *</label>
                            <textarea required className="input-dark w-full px-3 py-2 rounded-lg h-20"
                                value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-dark-300 text-sm mb-1">ملاحظات</label>
                            <textarea className="input-dark w-full px-3 py-2 rounded-lg h-16"
                                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">الفني</label>
                            <input className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.technician} onChange={e => setForm({ ...form, technician: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">التكلفة</label>
                            <input type="number" className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">سعر البيع</label>
                            <input type="number" className="input-dark w-full px-3 py-2 rounded-lg"
                                value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: e.target.value })} />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-success flex-1 py-2.5 rounded-xl font-semibold">
                            ✅ حفظ
                        </button>
                        <button type="button" onClick={onClose} className="btn-danger px-6 py-2.5 rounded-xl font-semibold">
                            إلغاء
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}