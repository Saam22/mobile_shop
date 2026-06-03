// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // ✅ استيراد الـ API
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 🔹 الاتصال الحقيقي بالباك إند
            const { data } = await api.post('/auth/login', { username, password });
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'فشل تسجيل الدخول');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ الجزء ده كان ناقص: الـ Return اللي بيظهر شكل الصفحة
    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-3xl">📱</span>
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">نظام إدارة المحل</h1>
                    <p className="text-dark-400 mt-2 text-sm">سجّل دخولك للمتابعة</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-dark-300 text-sm mb-2">اسم المستخدم</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-dark w-full px-4 py-3 rounded-xl text-right"
                            placeholder="أدخل اسم المستخدم"
                            dir="rtl"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-dark-300 text-sm mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-dark w-full px-4 py-3 rounded-xl text-right"
                            placeholder="أدخل كلمة المرور"
                            dir="rtl"
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                جاري الدخول...
                            </>
                        ) : 'تسجيل الدخول'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-dark-800/50 rounded-xl text-center text-xs text-dark-400">
                    <p>جرب كمدير: <span className="text-primary-400">admin / admin</span></p>
                    <p className="mt-1">جرب كموظف: <span className="text-primary-400">employee / employee</span></p>
                </div>
            </div>
        </div>
    );
};

// ✅ التصدير لازم يكون بره المكون تماماً
export default Login;