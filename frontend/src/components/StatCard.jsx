// src/components/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    trend,
    subValue,
    isWarning,
    delay = 0
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass rounded-2xl p-5 card-hover relative overflow-hidden group"
        >
            {/* Top Gradient Line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} rounded-t-2xl`}></div>

            {/* Warning Pulse Dot */}
            {isWarning && (
                <span className="absolute top-4 left-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
            )}

            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-dark-400 text-sm mb-1 truncate">{title}</p>
                    <p className="text-2xl font-bold text-dark-100 truncate">{value}</p>

                    {/* Sub Value */}
                    {subValue && (
                        <p className="text-xs text-dark-500 mt-1">{subValue}</p>
                    )}

                    {/* Trend Indicator */}
                    {trend !== undefined && (
                        <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${trend > 0 ? 'bg-green-500/10 text-green-400' :
                                trend < 0 ? 'bg-red-500/10 text-red-400' :
                                    'bg-dark-700 text-dark-400'
                            }`}>
                            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
                            <span>{Math.abs(trend)}%</span>
                        </div>
                    )}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </motion.div>
    );
}