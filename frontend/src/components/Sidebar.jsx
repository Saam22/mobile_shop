// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Wrench,
    Wallet, Receipt, Users2, FileBarChart, LogOut,
    ChevronLeft, ChevronRight, Smartphone
} from 'lucide-react';
// ✅ 1. استورد useAuth فقط (مش AuthContext)
import { useAuth } from '../context/AuthContext';

const menuItems = [
    { icon: LayoutDashboard, label: 'لوحة التحكم', path: '/' },
    { icon: Package, label: 'المخزون', path: '/inventory' },
    { icon: ShoppingCart, label: 'المبيعات', path: '/sales' },
    { icon: Users, label: 'العملاء', path: '/customers' },
    { icon: Wrench, label: 'الصيانة', path: '/maintenance' },
    { icon: Wallet, label: 'الخزنة', path: '/treasury' },
    { icon: Receipt, label: 'المصروفات', path: '/expenses' },
    { icon: Users2, label: 'الموظفين', path: '/employees' },
    { icon: FileBarChart, label: 'التقارير', path: '/reports' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    // ✅ 2. استخدم useAuth() هنا عشان تجيب بيانات اليوزر
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? '280px' : '80px',
                    x: isOpen ? 0 : '-100%'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`fixed lg:static inset-y-0 right-0 z-50 glass border-l border-dark-800 flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-dark-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Smartphone size={20} className="text-white" />
                        </div>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="overflow-hidden"
                            >
                                <h1 className="font-bold text-dark-100 whitespace-nowrap">محل الموبايلات</h1>
                                <p className="text-xs text-dark-500">نظام الإدارة المتكامل</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* User Info */}
                {isOpen && (
                    <div className="p-4 border-b border-dark-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 border border-primary-500/30 flex items-center justify-center">
                                <span className="text-primary-400 font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-dark-200 truncate">{user?.name}</p>
                                <p className="text-xs text-dark-500">
                                    {user?.role === 'admin' ? '👑 مدير النظام' : '👤 موظف'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all group
                  ${isActive
                                        ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                                        : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
                                    }
                `}
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Toggle Button & Logout */}
                <div className="p-3 border-t border-dark-800 space-y-2">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-dark-800 text-dark-400 hover:bg-dark-700 transition-colors"
                    >
                        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        {isOpen && <span className="text-sm">طي القائمة</span>}
                    </button>

                    {isOpen && (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">تسجيل الخروج</span>
                        </button>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;