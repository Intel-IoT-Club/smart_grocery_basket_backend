/**
 * Custom middleware functions for the Smart Grocery Basket API
 */

/**
 * Environment validation middleware
 */
const validateEnvironment = () => {
    const requiredEnvVars = ['MONGO_URI'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
        console.error('❌ Missing required environment variables:', missingEnvVars);
        process.exit(1);
    }
    
    console.log('✅ Environment variables validated successfully');
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
    
    // Log response time
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
};

/**
 * Error handling middleware
 */
const errorHandler = (error, req, res, next) => {
    console.error('Unhandled Error:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    // Default error response
    let status = error.status || error.statusCode || 500;
    let message = error.message || 'Internal server error';
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
        status = 400;
        message = 'Validation failed';
    } else if (error.name === 'CastError') {
        status = 400;
        message = 'Invalid data format';
    } else if (error.code === 11000) {
        status = 409;
        message = 'Duplicate entry';
    }
    
    // Prepare response
    const response = {
        success: false,
        error: message,
        timestamp: new Date().toISOString()
    };
    
    // Include additional details in development
    if (process.env.NODE_ENV !== 'production') {
        response.stack = error.stack;
        response.details = error.details || null;
    }
    
    res.status(status).json(response);
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString()
    });
};

/**
 * Validate request body middleware
 */
const validateRequiredFields = (requiredFields = []) => {
    return (req, res, next) => {
        const missingFields = requiredFields.filter(field => 
            req.body[field] === undefined || req.body[field] === null || req.body[field] === ''
        );
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                details: missingFields,
                timestamp: new Date().toISOString()
            });
        }
        
        next();
    };
};

/**
 * Sanitize input middleware
 */
const sanitizeInput = (req, res, next) => {
    // Sanitize string inputs
    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // Remove potential XSS and trim whitespace
                obj[key] = obj[key].trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };
    
    if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
    }
    
    if (req.query && typeof req.query === 'object') {
        sanitizeObject(req.query);
    }
    
    next();
};

/**
 * Rate limiting helper (basic implementation)
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Clean old entries
        for (const [ip, timestamps] of requests.entries()) {
            requests.set(ip, timestamps.filter(timestamp => timestamp > windowStart));
            if (requests.get(ip).length === 0) {
                requests.delete(ip);
            }
        }
        
        // Check current client
        if (!requests.has(clientIP)) {
            requests.set(clientIP, []);
        }
        
        const clientRequests = requests.get(clientIP);
        
        if (clientRequests.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests',
                message: 'Please try again later',
                timestamp: new Date().toISOString()
            });
        }
        
        clientRequests.push(now);
        requests.set(clientIP, clientRequests);
        
        next();
    };
};

module.exports = {
    validateEnvironment,
    requestLogger,
    errorHandler,
    notFoundHandler,
    validateRequiredFields,
    sanitizeInput,
    createRateLimiter
};
