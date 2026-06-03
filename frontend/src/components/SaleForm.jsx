import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const paymentMethods = [
    { id: 'cash', name: 'نقدي', icon: '💵' },
    { id: 'vodafone_cash', name: 'فودافون كاش', icon: '📱' },
    { id: 'etisalat_cash', name: 'اتصالات كاش', icon: '📱' },
    { id: 'we_pay', name: 'WE Pay', icon: '🌐' },
    { id: 'instapay', name: 'إنستا باي', icon: '💳' },
    { id: 'bank_transfer', name: 'تحويل بنكي', icon: '🏦' },
];

const SaleForm = ({ products, onSubmit, onClose }) => {
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState(0);
    const [isInstallment, setIsInstallment] = useState(false);
    const [installments, setInstallments] = useState({ count: 3, advance: 0 });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error('السلة فارغة');
            return;
        }
        if (!customer.name || !customer.phone) {
            toast.error('يرجى إدخال بيانات العميل');
            return;
        }

        const saleData = {
            customer,
            items: cart.map(item => ({
                product: item._id,
                name: item.name,
                quantity: item.quantity,
                unitPrice: item.sellingPrice,
                subtotal: item.sellingPrice * item.quantity
            })),
            subtotal,
            discount,
            total,
            paymentMethod,
            isInstallment,
            installments: isInstallment ? installments : undefined
        };

        onSubmit(saleData);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="xl:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-dark-200">المنتجات المتاحة</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                    {products.filter(p => p.quantity > 0).map((product) => (
                        <motion.button
                            key={product._id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addToCart(product)}
                            className="glass rounded-xl p-3 text-right card-hover"
                        >
                            <h4 className="text-sm font-medium text-dark-200 truncate mb-1">{product.name}</h4>
                            <p className="text-xs text-dark-500 font-mono mb-2">{product.code}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-green-400 font-bold text-sm">{product.sellingPrice?.toLocaleString()} ج.م</span>
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
                                    className="flex items-center gap-2 p-2 bg-dark-800/50 rounded-lg"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-dark-200 truncate">{item.name}</p>
                                        <p className="text-xs text-green-400">{item.sellingPrice?.toLocaleString()} ج.م</p>
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
                                    type="button"
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
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={cart.length === 0}
                        className="flex-1 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        إتمام البيع
                    </motion.button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold bg-dark-800 text-dark-300 hover:bg-dark-700 transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaleForm;