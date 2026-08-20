import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Filter, Edit2, Trash2, Barcode,
    Smartphone, Headphones, Battery, Cable, Shield,
    Package, CreditCard, HardDrive, Usb
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const categories = [
    { id: 'mobile_new', name: 'موبايلات جديدة', icon: Smartphone, color: 'from-green-500 to-emerald-600' },
    { id: 'mobile_used', name: 'موبايلات مستعملة', icon: Smartphone, color: 'from-yellow-500 to-orange-600' },
    { id: 'charger', name: 'شواحن', icon: Battery, color: 'from-blue-500 to-indigo-600' },
    { id: 'cable', name: 'وصلات', icon: Cable, color: 'from-purple-500 to-pink-600' },
    { id: 'headphone', name: 'سماعات', icon: Headphones, color: 'from-cyan-500 to-blue-600' },
    { id: 'case', name: 'جرابات', icon: Shield, color: 'from-rose-500 to-red-600' },
    { id: 'screen_protector', name: 'اسكرينات', icon: Package, color: 'from-amber-500 to-yellow-600' },
    { id: 'memory_card', name: 'كروت ميموري', icon: CreditCard, color: 'from-teal-500 to-green-600' },
    { id: 'usb_drive', name: 'فلاشات', icon: Usb, color: 'from-indigo-500 to-purple-600' },
    { id: 'powerbank', name: 'باور بانك', icon: Battery, color: 'from-orange-500 to-red-600' },
    { id: 'accessory', name: 'إكسسوارات أخرى', icon: Package, color: 'from-gray-500 to-slate-600' },
];

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showMobileDetails, setShowMobileDetails] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // grid or table

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            toast.error('فشل تحميل المنتجات');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.imei1 && p.imei1.includes(searchQuery)) ||
            (p.serialNumber && p.serialNumber.includes(searchQuery));
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
            toast.success('تم حذف المنتج بنجاح');
        } catch (err) {
            toast.error('فشل حذف المنتج');
        }
    };

    const handleAdd = async (product) => {
        try {
            const { data } = await api.post('/products', product);
            setProducts([data, ...products]);
            setShowAddModal(false);
            toast.success('تم إضافة المنتج بنجاح');
        } catch (err) {
            toast.error(err.response?.data?.error || 'فشل إضافة المنتج');
        }
    };

    const handleUpdate = async (id, updates) => {
        try {
            const { data } = await api.put(`/products/${id}`, updates);
            setProducts(products.map(p => p._id === id ? data : p));
            toast.success('تم تحديث المنتج بنجاح');
        } catch (err) {
            toast.error('فشل تحديث المنتج');
        }
    };

    return (
        <div className="space-y-6 page-enter">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">📦 إدارة المخزون والأصناف</h1>
                    <p className="text-dark-400 text-sm mt-1">إدارة جميع المنتجات والأصناف في المخزون</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    إضافة صنف جديد
                </motion.button>
            </div>

            {/* Categories */}
            <div className="glass rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={16} className="text-dark-400" />
                    <span className="text-sm text-dark-400">التصنيفات:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedCategory === 'all'
                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                            }`}
                    >
                        الكل ({products.length})
                    </button>
                    {categories.map(cat => {
                        const count = products.filter(p => p.category === cat.id).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all ${selectedCategory === cat.id
                                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                        : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                                    }`}
                            >
                                <cat.icon size={14} />
                                {cat.name} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search & View Toggle */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="بحث بالاسم، الكود، الباركود، IMEI..."
                        className="input-dark w-full pr-10 pl-4 py-2.5 rounded-xl"
                    />
                </div>
                <div className="flex bg-dark-800 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-dark-400'
                            }`}
                    >
                        شبكة
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${viewMode === 'table' ? 'bg-primary-500 text-white' : 'text-dark-400'
                            }`}
                    >
                        جدول
                    </button>
                </div>
            </div>

            {/* Products Grid/Table */}
            {loading ? (
                <div className="text-center py-20 text-dark-400">جاري التحميل...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 text-dark-400">لا توجد منتجات - اضغط "إضافة صنف جديد"</div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {filteredProducts.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -4 }}
                                className="glass rounded-2xl p-4 card-hover group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categories.find(c => c.id === product.category)?.color || 'from-gray-500 to-slate-600'
                                        } flex items-center justify-center`}>
                                        {React.createElement(
                                            categories.find(c => c.id === product.category)?.icon || Package,
                                            { size: 22, className: 'text-white' }
                                        )}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setSelectedProduct(product); setShowMobileDetails(true); }}
                                            className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-blue-400 transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-dark-200 text-sm mb-1 truncate">{product.name}</h3>
                                <p className="text-dark-500 text-xs font-mono mb-2">{product.code}</p>

                                {product.category.includes('mobile') && (
                                    <div className="flex gap-2 mb-2 text-xs text-dark-400">
                                        {product.color && <span>🎨 {product.color}</span>}
                                        {product.storage && <span>💾 {product.storage}</span>}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-800">
                                    <div>
                                        <p className="text-xs text-dark-500">سعر البيع</p>
                                        <p className="text-lg font-bold text-green-400">{product.sellingPrice.toLocaleString()} ج.م</p>
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
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="glass rounded-2xl p-5 table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>الكود</th>
                                <th>اسم الصنف</th>
                                <th>التصنيف</th>
                                <th>سعر الشراء</th>
                                <th>سعر البيع</th>
                                <th>الكمية</th>
                                <th>المورد</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id}>
                                    <td className="font-mono text-primary-400 text-sm">{product.code}</td>
                                    <td className="font-medium">{product.name}</td>
                                    <td>{categories.find(c => c.id === product.category)?.name}</td>
                                    <td className="text-dark-400">{product.purchasePrice?.toLocaleString() || '-'}</td>
                                    <td className="text-green-400 font-semibold">{product.sellingPrice.toLocaleString()}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-lg text-xs ${product.quantity <= product.alertQuantity
                                                ? 'bg-red-500/15 text-red-400'
                                                : 'bg-green-500/15 text-green-400'
                                            }`}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="text-dark-400 text-sm">{product.supplier || '-'}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => { setSelectedProduct(product); setShowMobileDetails(true); }}
                                                className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-blue-400 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="p-1.5 rounded-lg bg-dark-800 text-dark-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
            </AnimatePresence>

            {/* Mobile Details Modal */}
            <AnimatePresence>
                {showMobileDetails && selectedProduct && (
                    <MobileDetailsModal
                        product={selectedProduct}
                        onClose={() => setShowMobileDetails(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Add Product Modal Component
function AddProductModal({ onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '', code: '', barcode: '', category: 'mobile_new',
        supplier: '', purchasePrice: '', sellingPrice: '',
        quantity: '', alertQuantity: 5,
        // Mobile specific
        brand: '', model: '', color: '', storage: '',
        imei1: '', imei2: '', serialNumber: '', condition: 'new',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
    };

    const isMobile = formData.category.includes('mobile');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-dark-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark-100">➕ إضافة صنف جديد</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">اسم الصنف *</label>
                            <input
                                required
                                className="input-dark w-full px-3 py-2 rounded-lg"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">كود الصنف</label>
                            <input
                                className="input-dark w-full px-3 py-2 rounded-lg font-mono"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">التصنيف *</label>
                            <select
                                required
                                className="input-dark w-full px-3 py-2 rounded-lg"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">المورد</label>
                            <input
                                className="input-dark w-full px-3 py-2 rounded-lg"
                                value={formData.supplier}
                                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">سعر الشراء *</label>
                            <input
                                type="number"
                                required
                                className="input-dark w-full px-3 py-2 rounded-lg"
                                value={formData.purchasePrice}
                                onChange={e => setFormData({ ...formData, purchasePrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">سعر البيع *</label>
                            <input
                                type="number"
                                required
                                className="input-dark w-full px-3 py-2 rounded-lg"
                                value={formData.sellingPrice}
                                onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">الكمية *</label>
                            <input
                                type="number"
                                required
                                className="input-dark w-full px-3 py-2 rounded-lg"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-dark-300 text-sm mb-1">حد التنبيه</label>
                            <input
                                type="number"
                                className="input-dark w-full px-3 py-2 rounded-lg"
                                value={formData.alertQuantity}
                                onChange={e => setFormData({ ...formData, alertQuantity: e.target.value })}
                            />
                        </div>
                    </div>

                    {isMobile && (
                        <>
                            <div className="border-t border-dark-800 pt-4 mt-4">
                                <h3 className="text-sm font-semibold text-primary-400 mb-3">📱 بيانات الموبايل</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">الشركة</label>
                                        <input className="input-dark w-full px-3 py-2 rounded-lg"
                                            value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">الموديل</label>
                                        <input className="input-dark w-full px-3 py-2 rounded-lg"
                                            value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">اللون</label>
                                        <input className="input-dark w-full px-3 py-2 rounded-lg"
                                            value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">السعة</label>
                                        <input className="input-dark w-full px-3 py-2 rounded-lg"
                                            value={formData.storage} onChange={e => setFormData({ ...formData, storage: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">IMEI 1</label>
                                        <input className="input-dark w-full px-3 py-2 rounded-lg font-mono"
                                            value={formData.imei1} onChange={e => setFormData({ ...formData, imei1: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">IMEI 2</label>
                                        <input className="input-dark w-full px-3 py-2 rounded-lg font-mono"
                                            value={formData.imei2} onChange={e => setFormData({ ...formData, imei2: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">Serial Number</label>
                                        <input className="input-dark w-full px-3 py-2 rounded-lg font-mono"
                                            value={formData.serialNumber} onChange={e => setFormData({ ...formData, serialNumber: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-dark-300 text-sm mb-1">الحالة</label>
                                        <select className="input-dark w-full px-3 py-2 rounded-lg"
                                            value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                                            <option value="new">جديد</option>
                                            <option value="used">مستعمل</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-success flex-1 py-2.5 rounded-xl font-semibold">
                            ✅ حفظ المنتج
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

// Mobile Details Modal
function MobileDetailsModal({ product, onClose }) {
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
                    <h2 className="text-xl font-bold text-dark-100">📱 تفاصيل الجهاز</h2>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3">
                    <DetailRow label="الاسم" value={product.name} />
                    <DetailRow label="الكود" value={product.code} />
                    <DetailRow label="الشركة" value={product.brand} />
                    <DetailRow label="الموديل" value={product.model} />
                    <DetailRow label="اللون" value={product.color} />
                    <DetailRow label="السعة" value={product.storage} />
                    <DetailRow label="IMEI 1" value={product.imei1} />
                    <DetailRow label="IMEI 2" value={product.imei2} />
                    <DetailRow label="Serial Number" value={product.serialNumber} />
                    <DetailRow label="الحالة" value={product.condition === 'new' ? 'جديد' : 'مستعمل'} />
                    <DetailRow label="سعر الشراء" value={`${product.purchasePrice?.toLocaleString()} ج.م`} />
                    <DetailRow label="سعر البيع" value={`${product.sellingPrice.toLocaleString()} ج.م`} />
                    <DetailRow label="الكمية" value={`${product.quantity} قطعة`} />
                    <DetailRow label="المورد" value={product.supplier} />
                </div>
            </motion.div>
        </motion.div>
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