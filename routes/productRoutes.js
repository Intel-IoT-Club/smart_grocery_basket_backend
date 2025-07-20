const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        // Validate required fields
        const { productId, name, mrpPrice, stock } = req.body;
        
        if (!productId || !name || mrpPrice === undefined || stock === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: productId, name, mrpPrice, and stock are required'
            });
        }

        // Check if product with same ID already exists
        const existingProduct = await Product.findOne({ productId });
        if (existingProduct) {
            return res.status(409).json({
                success: false,
                error: 'Product with this ID already exists'
            });
        }

        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        
        res.status(201).json({
            success: true,
            data: savedProduct,
            message: 'Product created successfully'
        });
    } catch (error) {
        console.error('Create product error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: 'Product with this ID already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error while creating product'
        });
    }
});

/**
 * @desc    Get all products with optional filtering and pagination
 * @route   GET /api/products
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, inStock, page = 1, limit = 50, search } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (inStock === 'true') {
            filter.stock = { $gt: 0 };
        }
        
        if (search) {
            filter.$text = { $search: search };
        }
        
        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Execute query with pagination
        const [products, total] = await Promise.all([
            Product.find(filter)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 }),
            Product.countDocuments(filter)
        ]);
        
        res.json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching products'
        });
    }
});

/**
 * @desc    Get a single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }
        
        const product = await Product.findOne({ productId: id.trim() });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found',
                message: `No product found with ID: ${id}`
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching product'
        });
    }
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Public
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }
        
        // Prevent updating productId to avoid conflicts
        if (req.body.productId && req.body.productId !== id) {
            return res.status(400).json({
                success: false,
                error: 'Cannot change product ID'
            });
        }
        
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: id.trim() },
            { ...req.body, productId: id.trim() }, // Ensure productId remains unchanged
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                error: 'Product not found',
                message: `No product found with ID: ${id}`
            });
        }
        
        res.json({
            success: true,
            data: updatedProduct,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Update product error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Internal server error while updating product'
        });
    }
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id || id.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Product ID is required'
            });
        }
        
        const deletedProduct = await Product.findOneAndDelete({ productId: id.trim() });
        
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                error: 'Product not found',
                message: `No product found with ID: ${id}`
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while deleting product'
        });
    }
});

module.exports = router;
