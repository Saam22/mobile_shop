import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Package, ShoppingCart, Users, Wrench,
    Wallet, Receipt, Users2, BarChart3, LogOut,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../App';

const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'لوحة التحكم', roles: ['admin', 'employee'] },
    { path: '/inventory', icon: Package, label: 'المخزون والأصناف', roles: ['admin', 'employee'] },
    { path: '/sales', icon: ShoppingCart, label: 'المبيعات', roles: ['admin', 'employee'] },
    { path: '/customers', icon: Users, label: 'العملاء', roles: ['admin', 'employee'] },
    { path: '/maintenance', icon: Wrench, label: 'الصيانة', roles: ['admin', 'employee'] },
    { path: '/treasury', icon: Wallet, label: 'الخزينة والمحافظ', roles: ['admin'] },
    { path: '/expenses', icon: Receipt, label: 'المصروفات', roles: ['admin'] },
    { path: '/employees', icon: Users2, label: 'الموظفين', roles: ['admin'] },
    { path: '/reports', icon: BarChart3, label: 'التقارير', roles: ['admin'] },
];

export default function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 280 : 72 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-dark-900 border-l border-dark-800 flex flex-col h-full relative z-20"
        >
            {/* Logo */}
            <div className="p-4 border-b border-dark-800">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    >
                        <span className="text-xl">📱</span>
                    </motion.div>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <h1 className="text-lg font-bold gradient-text">موبايل شوب</h1>
                            <p className="text-dark-500 text-xs">نظام إدارة متكامل</p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -left-3 top-16 w-6 h-6 bg-dark-700 border border-dark-600 rounded-full flex items-center justify-center text-dark-400 hover:text-white transition-colors z-30"
            >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    if (!item.roles.includes(user.role)) return null;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-primary-500/15 text-primary-400 shadow-lg shadow-primary-500/5'
                                    : 'text-dark-400 hover:bg-dark-800 hover:text-dark-200'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className="flex-shrink-0" />
                                    {isOpen && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm font-medium whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                    {isActive && isOpen && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-3 border-t border-dark-800">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-dark-800/50">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">👤</span>
                    </div>
                    {isOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark-200 truncate">{user.name}</p>
                            <p className="text-xs text-dark-500">
                                {user.role === 'admin' ? 'مدير النظام' : 'موظف'}
                            </p>
                        </div>
                    )}
                </div>
                {isOpen && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm"
                    >
                        <LogOut size={18} />
                        <span>تسجيل الخروج</span>
                    </motion.button>
                )}
            </div>
        </motion.aside>
    );
}