const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    mrpPrice: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, required: true },
    category: { type: String },
    discounts: { type: Number, default: 0 },
    expiryDate: { type: Date }
});

module.exports = mongoose.model('Product', ProductSchema);
