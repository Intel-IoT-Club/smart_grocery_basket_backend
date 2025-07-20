/**
 * Application configuration settings
 */

const config = {
    // Server Configuration
    port: process.env.PORT || 5001,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    mongoUri: process.env.MONGO_URI,
    
    // CORS Configuration
    corsOrigins: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URLS?.split(',') || []
        : ['http://localhost:3000', 'http://localhost:3001'],
    
    // API Configuration
    apiPrefix: '/api',
    apiVersion: 'v1',
    
    // Request Limits
    jsonLimit: process.env.JSON_LIMIT || '10mb',
    
    // Pagination Defaults
    defaultPageSize: 50,
    maxPageSize: 100,
    
    // Product Categories
    productCategories: [
        'Dairy',
        'Fruits', 
        'Vegetables',
        'Grocery',
        'Bakery',
        'Beverages',
        'Snacks',
        'Other'
    ],
    
    // Supported Barcode Formats
    barcodeFormats: [
        'code_128',
        'code_39', 
        'code_93',
        'codabar',
        'ean_13',
        'ean_8',
        'itf',
        'pdf417',
        'upc_a',
        'upc_e',
        'qr_code'
    ]
};

// Validation
const validateConfig = () => {
    const required = ['mongoUri'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
};

module.exports = {
    config,
    validateConfig
};
