// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// مستخدمين للتجربة (استبدلهم بداتا بيز لاحقاً)
const users = [
    { id: '1', username: 'admin', password: 'admin', name: 'المدير', role: 'admin' },
    { id: '2', username: 'employee', password: 'employee', name: 'الموظف', role: 'employee' },
];

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'my_super_secret_key_change_this_in_production',
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: { id: user.id, name: user.name, username: user.username, role: user.role }
    });
});

module.exports = router;