const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search, lowStock } = req.query;
        let query = {};

        if (category) query.category = category;
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { code: new RegExp(search, 'i') },
                { barcode: new RegExp(search, 'i') },
                { imei1: new RegExp(search, 'i') },
                { serialNumber: new RegExp(search, 'i') }
            ];
        }
        if (lowStock) {
            query.$expr = { $lte: ['$quantity', '$alertQuantity'] };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create product
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'تم الحذف بنجاح' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check price validation (prevent selling below cost)
router.post('/validate-price', async (req, res) => {
    try {
        const { productId, sellingPrice, isAdmin } = req.body;
        const product = await Product.findById(productId);

        if (sellingPrice < product.purchasePrice) {
            if (!isAdmin) {
                return res.json({ valid: false, message: 'لا يمكن البيع بسعر أقل من سعر الشراء' });
            }
        }
        res.json({ valid: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;