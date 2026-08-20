const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.post('/', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ name: 1 });
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'تم الحذف بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/check-in', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        const now = new Date();
        employee.attendance = { checkIn: now, checkOut: null, date: now };
        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.patch('/:id/check-out', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        employee.attendance = { ...employee.attendance, checkOut: new Date() };
        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;