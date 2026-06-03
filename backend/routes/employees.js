const express = require('express');
const router = express.Router();
// هنا هتحط كود الموظفين لاحقاً
router.get('/', (req, res) => res.json({ message: 'Employees route works' }));
module.exports = router;