const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, unique: true },
    barcode: String,
    category: {
        type: String,
        enum: ['mobile_new', 'mobile_used', 'charger', 'cable', 'headphone', 'case', 'screen_protector', 'memory_card', 'usb_drive', 'powerbank', 'accessory'],
        required: true
    },
    supplier: { type: String, default: '' },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    minSellingPrice: { type: Number },
    quantity: { type: Number, default: 0 },
    alertQuantity: { type: Number, default: 5 },
    image: String,
    // For mobiles
    brand: String,
    model: String,
    color: String,
    storage: String,
    imei1: String,
    imei2: String,
    serialNumber: String,
    condition: { type: String, enum: ['new', 'used'], default: 'new' },
    purchaseDate: Date,
    sold: { type: Boolean, default: false },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    soldDate: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);