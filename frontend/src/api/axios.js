// src/api/axios.js
import axios from 'axios';

// إنشاء instance من axios بإعدادات مخصصة
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:6000/api', // غير البورت لو مختلف
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

// إضافة التوكن تلقائياً لكل طلب
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// معالجة الأخطاء تلقائياً
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // لو التوكن منتهي، امسكه وارجع لليوزر للوجين
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;