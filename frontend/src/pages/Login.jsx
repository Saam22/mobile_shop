import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; // ✅ استيراد من المكان الصحيح
// import api from '../api/axios'; // 👈 اختياري: لو عايز تربط بالباك إند

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // ✅ استخدام الهوك من الكونتكست الموحد
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 🔹 الاتصال الحقيقي بالباك إند
            const { data } = await api.post('/auth/login', { username, password });
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'فشل تسجيل الدخول');
            console.error('Login error:', err);
        }
    };

    export default Login;