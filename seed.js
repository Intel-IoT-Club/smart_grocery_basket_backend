const mongoose = require('mongoose');
require('dotenv').config();

// Import the Product model to ensure consistency
const Product = require('./models/Product');

/**
 * Database seeding script for Smart Grocery Basket
 * Seeds the database with sample product data
 */

// Validate environment
if (!process.env.MONGO_URI) {
    console.error('❌ Error: MONGO_URI environment variable is not set');
    process.exit(1);
}

// Enhanced sample data with more variety
const sampleProducts = [
    {
        productId: 'P001',
        name: 'Amul Milk (1L)',
        mrpPrice: 65.0,
        image: 'https://via.placeholder.com/100',
        stock: 50,
        category: 'Dairy',
        discounts: '10% off',
        expiryDate: '2025-08-15'
    },
    {
        productId: 'P002',
        name: 'Fresh Apples (1kg)',
        mrpPrice: 180.0,
        image: 'https://via.placeholder.com/100',
        stock: 30,
        category: 'Fruits',
        discounts: '5% off',
        expiryDate: '2025-08-10'
    },
    {
        productId: 'P003',
        name: 'Fresh Broccoli (500g)',
        mrpPrice: 70.0,
        image: 'https://via.placeholder.com/100',
        stock: 20,
        category: 'Vegetables',
        discounts: '15% off',
        expiryDate: '2025-08-12'
    },
    {
        productId: 'P004',
        name: 'Fortune Sunflower Oil (1L)',
        mrpPrice: 160.0,
        image: 'https://via.placeholder.com/100',
        stock: 40,
        category: 'Grocery',
        discounts: '10% cashback',
        expiryDate: '2026-06-30'
    },
    {
        productId: 'P005',
        name: 'Britannia Bread (400g)',
        mrpPrice: 50.0,
        image: 'https://via.placeholder.com/100',
        stock: 60,
        category: 'Bakery',
        discounts: 'Buy 1 Get 1 Free',
        expiryDate: '2025-08-28'
    },
    {
        productId: 'P006',
        name: 'Coca Cola (500ml)',
        mrpPrice: 40.0,
        image: 'https://via.placeholder.com/100',
        stock: 100,
        category: 'Beverages',
        discounts: '5% off',
        expiryDate: '2025-12-31'
    },
    {
        productId: 'P007',
        name: 'Lays Chips (50g)',
        mrpPrice: 20.0,
        image: 'https://via.placeholder.com/100',
        stock: 80,
        category: 'Snacks',
        discounts: 'Buy 2 Get 1 Free',
        expiryDate: '2025-06-15'
    },
    {
        productId: 'P008',
        name: 'Basmati Rice (5kg)',
        mrpPrice: 450.0,
        image: 'https://via.placeholder.com/100',
        stock: 25,
        category: 'Grocery',
        discounts: '8% off',
        expiryDate: '2026-01-01'
    }
];

/**
 * Connect to MongoDB with proper error handling
 */
const connectDatabase = async () => {
    try {
        const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        };

        await mongoose.connect(process.env.MONGO_URI, mongoOptions);
        console.log('✅ Connected to MongoDB for seeding');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};

/**
 * Seed the database with sample products
 */
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Clear existing products
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️  Removed ${deleteResult.deletedCount} existing products`);
        
        // Insert new sample products with validation
        const insertedProducts = [];
        
        for (const productData of sampleProducts) {
            try {
                const product = new Product(productData);
                const savedProduct = await product.save();
                insertedProducts.push(savedProduct);
                console.log(`✅ Added product: ${savedProduct.name} (${savedProduct.productId})`);
            } catch (error) {
                console.error(`❌ Failed to add product ${productData.productId}:`, error.message);
            }
        }
        
        console.log(`\n🎉 Successfully seeded database with ${insertedProducts.length} products!`);
        
        // Display summary
        const categories = [...new Set(insertedProducts.map(p => p.category))];
        console.log(`📊 Categories added: ${categories.join(', ')}`);
        console.log(`💰 Price range: ₹${Math.min(...insertedProducts.map(p => p.mrpPrice))} - ₹${Math.max(...insertedProducts.map(p => p.mrpPrice))}`);
        
    } catch (error) {
        console.error('❌ Database seeding failed:', error.message);
        throw error;
    }
};

/**
 * Graceful cleanup and exit
 */
const cleanup = async (exitCode = 0) => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('📦 Database connection closed');
        }
    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
    } finally {
        process.exit(exitCode);
    }
};

/**
 * Main execution function
 */
const main = async () => {
    try {
        await connectDatabase();
        await seedDatabase();
        console.log('\n✨ Seeding completed successfully!');
        await cleanup(0);
    } catch (error) {
        console.error('\n❌ Seeding process failed:', error.message);
        await cleanup(1);
    }
};

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, cleaning up...');
    cleanup(1);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, cleaning up...');
    cleanup(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    cleanup(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    cleanup(1);
});

// Run the seeding process
if (require.main === module) {
    console.log('🚀 Smart Grocery Basket - Database Seeder');
    console.log('📍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔗 MongoDB URI:', process.env.MONGO_URI ? '✅ Configured' : '❌ Missing');
    console.log('----------------------------------------\n');
    
    main();
}
