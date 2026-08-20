import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Printer, Send, FileText, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const paymentMethods = [
    { id: 'cash', name: 'نقدي', icon: '💵' },
    { id: 'vodafone_cash', name: 'فودافون كاش', icon: '📱' },
    { id: 'etisalat_cash', name: 'اتصالات كاش', icon: '📱' },
    { id: 'we_pay', name: 'WE Pay', icon: '🌐' },
    { id: 'instapay', name: 'إنستا باي', icon: '💳' },
    { id: 'bank_transfer', name: 'تحويل بنكي', icon: '🏦' },
];

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);
    const [isInstallment, setIsInstallment] = useState(false);
    const [installments, setInstallments] = useState({ count: 3, advance: 0 });

    useEffect(() => {
        loadProducts();
        loadCustomers();
    }, []);

    const loadProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            toast.error('فشل تحميل المنتجات');
        }
    };

    const loadCustomers = async () => {
        try {
            const { data } = await api.get('/customers');
            setCustomers(data);
        } catch (err) {
            toast.error('فشل تحميل العملاء');
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            if (existing.quantity >= product.quantity) {
                toast.error('الكمية غير متوفرة في المخزون');
                return;
            }
            setCart(cart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item._id === id) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                if (newQty > item.quantity) {
                    toast.error('الكمية غير متوفرة');
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    const total = subtotal - discount;
    const profit = cart.reduce((sum, item) => sum + ((item.sellingPrice - item.purchasePrice) * item.quantity), 0) - discount;

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error('السلة فارغة');
            return;
        }
        if (!customer.name || !customer.phone) {
            toast.error('يرجى إدخال بيانات العميل');
            return;
        }
        try {
            const existingCustomer = customers.find(c => c.phone === customer.phone);
            let customerId = existingCustomer?._id;
            if (!existingCustomer) {
                const { data } = await api.post('/customers', { name: customer.name, phone: customer.phone });
                customerId = data._id;
            }

            const paid = isInstallment ? Math.min(installments.advance || 0, total) : total;
            const remaining = total - paid;
            const installmentAmount = remaining / (installments.count || 1);

            await api.post('/sales', {
                customer: customerId,
                customerName: customer.name,
                customerPhone: customer.phone,
                items: cart.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: item.sellingPrice,
                    purchasePrice: item.purchasePrice,
                    subtotal: item.sellingPrice * item.quantity,
                })),
                subtotal,
                discount,
                tax: 0,
                total,
                paymentMethod,
                paid,
                remaining,
                isInstallment,
                installments: isInstallment && remaining > 0 ? Array.from({ length: installments.count || 1 }, (_, i) => ({
                    dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000),
                    amount: Math.round(installmentAmount),
                    paid: false,
                })) : [],
            });
            setShowReceipt(true);
            toast.success('تم إنشاء الفاتورة بنجاح ✅');
            setCart([]);
            setCustomer({ name: '', phone: '' });
            setDiscount(0);
            loadProducts();
        } catch (err) {
            toast.error(err.response?.data?.error || 'فشل إنشاء الفاتورة');
        }
    };

    return (
        <div className="space-y-6 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">🛒 نقطة البيع</h1>
                    <p className="text-dark-400 text-sm mt-1">إنشاء فاتورة بيع جديدة</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Products Section */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="🔍 بحث عن منتج بالاسم أو الكود أو الباركود..."
                            className="input-dark w-full px-4 py-3 rounded-xl"
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                        {filteredProducts.length === 0 && <div className="col-span-full text-center py-10 text-dark-400">لا توجد منتجات</div>}
                        {filteredProducts.map((product, i) => (
                            <motion.button
                                key={product._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => addToCart(product)}
                                className="glass rounded-xl p-3 text-right card-hover"
                            >
                                <h4 className="text-sm font-medium text-dark-200 truncate mb-1">{product.name}</h4>
                                <p className="text-xs text-dark-500 font-mono mb-2">{product.code}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-green-400 font-bold text-sm">{product.sellingPrice.toLocaleString()} ج.م</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${product.quantity > 10 ? 'bg-green-500/15 text-green-400' :
                                            product.quantity > 0 ? 'bg-yellow-500/15 text-yellow-400' :
                                                'bg-red-500/15 text-red-400'
                                        }`}>
                                        {product.quantity} متاح
                                    </span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Cart Section */}
                <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="glass rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-dark-300 mb-3">👤 بيانات العميل</h3>
                        <div className="space-y-2">
                            <select
                                className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                                value=""
                                onChange={e => {
                                    const c = customers.find(x => x._id === e.target.value);
                                    if (c) setCustomer({ name: c.name, phone: c.phone });
                                }}
                            >
                                <option value="">-- اختيار عميل موجود --</option>
                                {customers.map(c => <option key={c._id} value={c._id}>{c.name} - {c.phone}</option>)}
                            </select>
                            <input
                                placeholder="اسم العميل"
                                className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                                value={customer.name}
                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                            />
                            <input
                                placeholder="رقم الهاتف"
                                className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                                value={customer.phone}
                                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="glass rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-dark-300 mb-3">🛒 السلة ({cart.length})</h3>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {cart.length === 0 ? (
                                <p className="text-dark-500 text-sm text-center py-4">السلة فارغة</p>
                            ) : (
                                cart.map(item => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-lg"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-dark-200 truncate">{item.name}</p>
                                            <p className="text-xs text-green-400">{item.sellingPrice.toLocaleString()} ج.م</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => updateQuantity(item._id, -1)}
                                                className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center text-dark-300 hover:bg-dark-600"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, 1)}
                                                className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center text-dark-300 hover:bg-dark-600"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-semibold w-20 text-left">
                                            {(item.sellingPrice * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Payment & Discount */}
                    <div className="glass rounded-2xl p-4 space-y-3">
                        <div>
                            <label className="text-sm text-dark-400 mb-1 block">الخصم</label>
                            <input
                                type="number"
                                className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                                value={discount}
                                onChange={e => setDiscount(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-dark-400 mb-2 block">طريقة الدفع</label>
                            <div className="grid grid-cols-2 gap-2">
                                {paymentMethods.map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${paymentMethod === method.id
                                                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                                            }`}
                                    >
                                        <span>{method.icon}</span>
                                        {method.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="installment"
                                checked={isInstallment}
                                onChange={e => setIsInstallment(e.target.checked)}
                                className="rounded"
                            />
                            <label htmlFor="installment" className="text-sm text-dark-300">بيع بالأقساط</label>
                        </div>

                        {isInstallment && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2"
                            >
                                <input
                                    type="number"
                                    placeholder="المقدم"
                                    className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                                    value={installments.advance}
                                    onChange={e => setInstallments({ ...installments, advance: Number(e.target.value) })}
                                />
                                <input
                                    type="number"
                                    placeholder="عدد الأقساط"
                                    className="input-dark w-full px-3 py-2 rounded-lg text-sm"
                                    value={installments.count}
                                    onChange={e => setInstallments({ ...installments, count: Number(e.target.value) })}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="glass rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-dark-400">المجموع</span>
                            <span>{subtotal.toLocaleString()} ج.م</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-dark-400">الخصم</span>
                                <span className="text-red-400">- {discount.toLocaleString()} ج.م</span>
                            </div>
                        )}
                        <div className="border-t border-dark-800 pt-2 flex justify-between">
                            <span className="font-semibold text-dark-200">الإجمالي</span>
                            <span className="font-bold text-xl text-primary-400">{total.toLocaleString()} ج.م</span>
                        </div>
                        <div className="flex justify-between text-xs text-dark-500">
                            <span>الربح المتوقع</span>
                            <span className="text-green-400">{profit.toLocaleString()} ج.م</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        إتمام البيع
                    </motion.button>
                </div>
            </div>

            {/* Receipt Modal */}
            <AnimatePresence>
                {showReceipt && (
                    <ReceiptModal
                        customer={customer}
                        cart={cart}
                        total={total}
                        discount={discount}
                        paymentMethod={paymentMethod}
                        onClose={() => setShowReceipt(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Receipt Modal
function ReceiptModal({ customer, cart, total, discount, paymentMethod, onClose }) {
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
                className="glass rounded-2xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 text-center border-b border-dark-800">
                    <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-3">
                        <span className="text-3xl">✅</span>
                    </div>
                    <h2 className="text-xl font-bold text-dark-100">تم إنشاء الفاتورة</h2>
                    <p className="text-dark-400 text-sm mt-1">INV-{String(Math.floor(Math.random() * 999999)).padStart(6, '0')}</p>
                </div>

                <div className="p-6 space-y-3">
                    <div className="text-sm space-y-1">
                        <p><span className="text-dark-400">العميل:</span> {customer.name}</p>
                        <p><span className="text-dark-400">الهاتف:</span> {customer.phone}</p>
                        <p><span className="text-dark-400">الدفع:</span> {paymentMethods.find(m => m.id === paymentMethod)?.name}</p>
                    </div>

                    <div className="border-t border-dark-800 pt-3">
                        {cart.map(item => (
                            <div key={item._id} className="flex justify-between text-sm py-1">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{(item.sellingPrice * item.quantity).toLocaleString()} ج.م</span>
                            </div>
                        ))}
                        {discount > 0 && (
                            <div className="flex justify-between text-sm py-1 text-red-400">
                                <span>خصم</span>
                                <span>- {discount.toLocaleString()} ج.م</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-dark-800">
                            <span>الإجمالي</span>
                            <span className="text-primary-400">{total.toLocaleString()} ج.م</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-dark-800 grid grid-cols-3 gap-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors"
                    >
                        <Printer size={20} className="text-blue-400" />
                        <span className="text-xs text-dark-300">طباعة</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors"
                    >
                        <Send size={20} className="text-green-400" />
                        <span className="text-xs text-dark-300">واتساب</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-dark-800 hover:bg-dark-700 transition-colors"
                    >
                        <FileText size={20} className="text-purple-400" />
                        <span className="text-xs text-dark-300">PDF</span>
                    </motion.button>
                </div>

                <div className="p-4 border-t border-dark-800">
                    <button
                        onClick={onClose}
                        className="w-full py-2 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors"
                    >
                        إغلاق
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}