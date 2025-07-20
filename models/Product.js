const mongoose = require('mongoose');

/**
 * Product Schema for grocery items
 * Represents products available in the smart grocery basket system
 */
const ProductSchema = new mongoose.Schema({
    // Using consistent field naming (productId instead of productID)
    productId: { 
        type: String, 
        required: [true, 'Product ID is required'], 
        unique: true,
        trim: true,
        index: true // Add index for faster queries
    },
    name: { 
        type: String, 
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [200, 'Product name cannot exceed 200 characters']
    },
    mrpPrice: { 
        type: Number, 
        required: [true, 'MRP price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: function(v) {
                return v >= 0;
            },
            message: 'Price must be a positive number'
        }
    },
    image: { 
        type: String,
        trim: true,
        default: 'https://via.placeholder.com/100' // Provide default image
    },
    stock: { 
        type: Number, 
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    category: { 
        type: String,
        trim: true,
        enum: {
            values: ['Dairy', 'Fruits', 'Vegetables', 'Grocery', 'Bakery', 'Beverages', 'Snacks', 'Other'],
            message: 'Category must be one of the predefined values'
        },
        default: 'Other'
    },
    // Changed from Number to String to match frontend expectations
    discounts: { 
        type: String, 
        default: '',
        trim: true
    },
    expiryDate: { 
        type: String, // Changed to String to match existing data format
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow empty values
                // Basic date format validation (YYYY-MM-DD)
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: 'Expiry date must be in YYYY-MM-DD format'
        }
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            // Remove internal MongoDB fields from JSON output
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Add virtual field for formatted price
ProductSchema.virtual('formattedPrice').get(function() {
    return `₹${this.mrpPrice.toFixed(2)}`;
});

// Add virtual field to check if product is in stock
ProductSchema.virtual('isInStock').get(function() {
    return this.stock > 0;
});

// Add virtual field to check if product is expired
ProductSchema.virtual('isExpired').get(function() {
    if (!this.expiryDate) return false;
    const expiryDate = new Date(this.expiryDate);
    return expiryDate < new Date();
});

// Index for better query performance
ProductSchema.index({ category: 1, stock: 1 });
ProductSchema.index({ name: 'text', category: 'text' }); // Text search index

module.exports = mongoose.model('Product', ProductSchema);
