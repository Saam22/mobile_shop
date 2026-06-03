import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color, trend, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass rounded-2xl p-5 card-hover relative overflow-hidden"
        >
            {/* Background Gradient */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-dark-400 text-sm mb-1">{title}</p>
                    <p className="text-2xl font-bold text-dark-100">{value}</p>
                    {trend && (
                        <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% عن الشهر الماضي
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </motion.div>
    );
}