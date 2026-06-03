// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Demo users (استبدلهم بداتا بيز لاحقاً)
const users = [
    { id: '1', username: 'admin', password: 'admin', name: 'المدير', role: 'admin' },
    { id: '2', username: 'employee', password: 'employee', name: 'الموظف', role: 'employee' },
];

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // إنشاء توكن
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'my_secret_key',
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: { id: user.id, name: user.name, role: user.role, username: user.username }
    });
});

module.exports = router;