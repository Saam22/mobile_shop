import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const roleLabels = {
    admin: 'مدير عام',
    sales: 'مبيعات',
    technician: 'فني صيانة',
    cashier: 'كاشير',
    manager: 'مدير فرع',
};

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/employees');
            setEmployees(data);
        } catch (err) {
            toast.error('فشل تحميل الموظفين');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (employee) => {
        try {
            const { data } = await api.post('/employees', employee);
            setEmployees([...employees, data]);
            setShowAddModal(false);
            toast.success('تم إضافة الموظف بنجاح');
        } catch (err) {
            toast.error(err.response?.data?.error || 'فشل إضافة الموظف');
        }
    };

    const checkIn = async (id) => {
        try {
            const { data } = await api.patch(`/employees/${id}/check-in`);
            setEmployees(employees.map(e => e._id === id ? data : e));
            toast.success('تم تسجيل الحضور');
        } catch (err) {
            toast.error('فشل تسجيل الحضور');
        }
    };

    const checkOut = async (id) => {
        try {
            const { data } = await api.patch(`/employees/${id}/check-out`);
            setEmployees(employees.map(e => e._id === id ? data : e));
            toast.success('تم تسجيل الانصراف');
        } catch (err) {
            toast.error('فشل تسجيل الانصراف');
        }
    };

    const isCheckedIn = (emp) => {
        const today = new Date().toDateString();
        return emp.attendance?.checkIn && new Date(emp.attendance.date).toDateString() === today;
    };

    const isCheckedOut = (emp) => isCheckedIn(emp) && emp.attendance?.checkOut;

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">👨‍💼 إدارة الموظفين</h1>
                    <p className="text-dark-400 text-sm mt-1">متابعة الحضور والانصراف والرواتب</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    إضافة موظف
                </motion.button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-dark-400">جاري التحميل...</div>
            ) : employees.length === 0 ? (
                <div className="text-center py-20 text-dark-400">لا يوجد موظفين - اضغط "إضافة موظف"</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp, i) => (
                    <motion.div
                        key={emp._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass rounded-2xl p-5 card-hover"
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-lg">
                                {emp.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-dark-100">{emp.name}</h3>
                                <p className="text-dark-400 text-sm">{roleLabels[emp.role] || emp.role}</p>
                            </div>
                            <span className={`mr-auto px-2 py-1 rounded-lg text-xs ${emp.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                                }`}>
                                {emp.status === 'active' ? 'نشط' : 'غير نشط'}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <p className="text-sm text-dark-300">📞 {emp.phone}</p>
                            <p className="text-sm text-dark-300">💰 الراتب: {(emp.salary || 0).toLocaleString()} ج.م</p>
                            {isCheckedIn(emp) && (
                                <p className="text-sm text-green-400 flex items-center gap-1">
                                    <Clock size={12} /> دخول: {new Date(emp.attendance.checkIn).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                            {isCheckedOut(emp) && (
                                <p className="text-sm text-orange-400 flex items-center gap-1">
                                    <Clock size={12} /> خروج: {new Date(emp.attendance.checkOut).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {!isCheckedIn(emp) ? (
                                <button
                                    onClick={() => checkIn(emp._id)}
                                    className="flex-1 py-2 rounded-lg bg-green-500/15 text-green-400 text-sm hover:bg-green-500/25 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Clock size={14} /> تسجيل دخول
                                </button>
                            ) : !isCheckedOut(emp) ? (
                                <button
                                    onClick={() => checkOut(emp._id)}
                                    className="flex-1 py-2 rounded-lg bg-orange-500/15 text-orange-400 text-sm hover:bg-orange-500/25 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Calendar size={14} /> تسجيل خروج
                                </button>
                            ) : (
                                <span className="flex-1 py-2 rounded-lg bg-dark-800 text-dark-400 text-sm text-center">
                                    ✅ تم الانتهاء
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            )}

            <AnimatePresence>
                {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
            </AnimatePresence>
        </div>
    );
}

function AddEmployeeModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ name: '', phone: '', salary: '', role: 'sales' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...form, salary: Number(form.salary) || 0 });
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
                    <h2 className="text-xl font-bold text-dark-100">➕ إضافة موظف</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input required placeholder="اسم الموظف" className="input-dark w-full px-3 py-2 rounded-lg"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input required placeholder="رقم الهاتف" className="input-dark w-full px-3 py-2 rounded-lg"
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <input required type="number" placeholder="الراتب" className="input-dark w-full px-3 py-2 rounded-lg"
                        value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
                    <select className="input-dark w-full px-3 py-2 rounded-lg"
                        value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                        <option value="sales">مبيعات</option>
                        <option value="technician">فني صيانة</option>
                        <option value="cashier">كاشير</option>
                        <option value="manager">مدير فرع</option>
                    </select>
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-success flex-1 py-2.5 rounded-xl font-semibold">حفظ</button>
                        <button type="button" onClick={onClose} className="btn-danger px-6 py-2.5 rounded-xl font-semibold">إلغاء</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}