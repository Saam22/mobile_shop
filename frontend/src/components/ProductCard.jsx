import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Smartphone, Battery, Headphones, Cable, Shield, Package } from 'lucide-react';

const categoryIcons = {
    mobile_new: Smartphone,
    mobile_used: Smartphone,
    charger: Battery,
    cable: Cable,
    headphone: Headphones,
    case: Shield,
    screen_protector: Package,
    memory_card: Package,
    usb_drive: Package,
    powerbank: Battery,
    accessory: Package,
};

const categoryColors = {
    mobile_new: 'from-green-500 to-emerald-600',
    mobile_used: 'from-yellow-500 to-orange-600',
    charger: 'from-blue-500 to-indigo-600',
    cable: 'from-purple-500 to-pink-600',
    headphone: 'from-cyan-500 to-blue-600',
    case: 'from-rose-500 to-red-600',
    screen_protector: 'from-amber-500 to-yellow-600',
    memory_card: 'from-teal-500 to-green-600',
    usb_drive: 'from-indigo-500 to-purple-600',
    powerbank: 'from-orange-500 to-red-600',
    accessory: 'from-gray-500 to-slate-600',
};

const ProductCard = ({ product, onEdit, onDelete }) => {
    const Icon = categoryIcons[product.category] || Package;
    const colorClass = categoryColors[product.category] || 'from-gray-500 to-slate-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-4 card-hover group"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                    <Icon size={22} className="text-white" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-blue-400 transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(product._id)}
                        className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <h3 className="font-semibold text-dark-200 text-sm mb-1 truncate">{product.name}</h3>
            <p className="text-dark-500 text-xs font-mono mb-2">{product.code || 'بدون كود'}</p>

            {product.category.includes('mobile') && (
                <div className="flex gap-2 mb-2 text-xs text-dark-400">
                    {product.color && <span>🎨 {product.color}</span>}
                    {product.storage && <span>💾 {product.storage}</span>}
                </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-800">
                <div>
                    <p className="text-xs text-dark-500">سعر البيع</p>
                    <p className="text-lg font-bold text-green-400">{product.sellingPrice?.toLocaleString()} ج.م</p>
                </div>
                <div className="text-left">
                    <p className="text-xs text-dark-500">الكمية</p>
                    <span className={`text-sm font-semibold ${product.quantity <= product.alertQuantity ? 'text-red-400' : 'text-dark-200'
                        }`}>
                        {product.quantity} قطعة
                    </span>
                </div>
            </div>

            {product.quantity <= product.alertQuantity && (
                <div className="mt-2 p-1.5 bg-red-500/10 rounded-lg text-center">
                    <span className="text-xs text-red-400">⚠️ قارب على النفاد</span>
                </div>
            )}
        </motion.div>
    );
};

export default ProductCard;