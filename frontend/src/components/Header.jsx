import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ تأكد إن السطر ده موجود
import {
    Bell, Search, Menu, X, User, LogOut, Settings, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Demo notifications
    const notifications = [
        { id: 1, text: 'تم بيع جهاز آيفون 14 برو', time: 'منذ 5 دقائق', type: 'sale' },
        { id: 2, text: 'تنبيه: كمية سماعات AirPods قليلة', time: 'منذ ساعة', type: 'warning' },
        { id: 3, text: 'تم استلام طلب صيانة جديد', time: 'منذ 3 ساعات', type: 'maintenance' },
    ];

    return (
        <header className="glass border-b border-dark-800 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Right: Sidebar Toggle + Search */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors lg:hidden"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
                        <input
                            type="text"
                            placeholder="ابحث عن منتج، عميل، فاتورة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-dark pr-10 pl-4 py-2 rounded-xl w-64 lg:w-80 text-sm"
                        />
                    </div>
                </div>

                {/* Left: Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1 left-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-900"></span>
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 mt-2 w-80 glass rounded-2xl p-4 z-50 shadow-xl border border-dark-700"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-dark-200">الإشعارات</h3>
                                        <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full">
                                            {notifications.length} جديد
                                        </span>
                                    </div>

                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {notifications.map((note) => (
                                            <div
                                                key={note.id}
                                                className="p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors cursor-pointer"
                                            >
                                                <p className="text-sm text-dark-200">{note.text}</p>
                                                <p className="text-xs text-dark-500 mt-1">{note.time}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full mt-3 text-xs text-primary-400 hover:text-primary-300 transition-colors">
                                        عرض كل الإشعارات
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Theme Toggle (Demo) */}
                    <button className="p-2 rounded-lg bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors">
                        <Moon size={20} />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-2 p-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <span className="hidden md:block text-sm font-medium text-dark-200">
                                {user?.name || 'مستخدم'}
                            </span>
                        </button>

                        <AnimatePresence>
                            {showProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 mt-2 w-48 glass rounded-2xl p-2 z-50 shadow-xl border border-dark-700"
                                >
                                    <div className="px-3 py-2 border-b border-dark-800">
                                        <p className="text-sm font-medium text-dark-200">{user?.name}</p>
                                        <p className="text-xs text-dark-500">{user?.role === 'admin' ? 'مدير النظام' : 'موظف'}</p>
                                    </div>

                                    <button className="w-full text-right px-3 py-2 text-sm text-dark-300 hover:bg-dark-800 rounded-lg flex items-center gap-2 transition-colors">
                                        <Settings size={14} />
                                        الإعدادات
                                    </button>

                                    <button
                                        onClick={() => {
                                            logout();
                                            setShowProfile(false);
                                        }}
                                        className="w-full text-right px-3 py-2 text-sm text-red-400 hover:bg-dark-800 rounded-lg flex items-center gap-2 transition-colors mt-1"
                                    >
                                        <LogOut size={14} />
                                        تسجيل الخروج
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;