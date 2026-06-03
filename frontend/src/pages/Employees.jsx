import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const sampleEmployees = [
    { id: 1, name: 'مهندس علي', phone: '01011111111', salary: 5000, role: 'فني صيانة', status: 'present', checkIn: '09:00', checkOut: null },
    { id: 2, name: 'أحمد محمود', phone: '01122222222', salary: 4000, role: 'مبيعات', status: 'present', checkIn: '08:45', checkOut: null },
    { id: 3, name: 'سارة أحمد', phone: '01233333333', salary: 3500, role: 'كاشير', status: 'absent', checkIn: null, checkOut: null },
];

export default function Employees() {
    const [employees, setEmployees] = useState(sampleEmployees);
    const [showAddModal, setShowAddModal] = useState(false);

    const checkIn = (id) => {
        const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        setEmployees(employees.map(e => e.id === id ? { ...e, status: 'present', checkIn: now } : e));
        toast.success('تم تسجيل الحضور');
    };

    const checkOut = (id) => {
        const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        setEmployees(employees.map(e => e.id === id ? { ...e, checkOut: now } : e));
        toast.success('تم تسجيل الانصراف');
    };

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp, i) => (
                    <motion.div
                        key={emp.id}
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
                                <p className="text-dark-400 text-sm">{emp.role}</p>
                            </div>
                            <span className={`mr-auto px-2 py-1 rounded-lg text-xs ${emp.status === 'present' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                                }`}>
                                {emp.status === 'present' ? 'حاضر' : 'غائب'}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <p className="text-sm text-dark-300">📞 {emp.phone}</p>
                            <p className="text-sm text-dark-300">💰 الراتب: {emp.salary.toLocaleString()} ج.م</p>
                            {emp.checkIn && (
                                <p className="text-sm text-green-400 flex items-center gap-1">
                                    <Clock size={12} /> دخول: {emp.checkIn}
                                </p>
                            )}
                            {emp.checkOut && (
                                <p className="text-sm text-orange-400 flex items-center gap-1">
                                    <Clock size={12} /> خروج: {emp.checkOut}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {!emp.checkIn ? (
                                <button
                                    onClick={() => checkIn(emp.id)}
                                    className="flex-1 py-2 rounded-lg bg-green-500/15 text-green-400 text-sm hover:bg-green-500/25 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Clock size={14} /> تسجيل دخول
                                </button>
                            ) : !emp.checkOut ? (
                                <button
                                    onClick={() => checkOut(emp.id)}
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

            <AnimatePresence>
                {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} />}
            </AnimatePresence>
        </div>
    );
}

function AddEmployeeModal({ onClose }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('تم إضافة الموظف بنجاح');
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
                    <h2 className="text-xl font-bold text-dark-100">➕ إضافة موظف</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input required placeholder="اسم الموظف" className="input-dark w-full px-3 py-2 rounded-lg" />
                    <input required placeholder="رقم الهاتف" className="input-dark w-full px-3 py-2 rounded-lg" />
                    <input required type="number" placeholder="الراتب" className="input-dark w-full px-3 py-2 rounded-lg" />
                    <select className="input-dark w-full px-3 py-2 rounded-lg">
                        <option>مبيعات</option>
                        <option>فني صيانة</option>
                        <option>كاشير</option>
                        <option>مدير فرع</option>
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