const mongoose = require('mongoose');

/**
 * Database configuration and connection utilities
 */

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        const mongoOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Log connection state changes
        mongoose.connection.on('connected', () => {
            console.log('📦 Mongoose connected to DB');
        });
        
        mongoose.connection.on('error', (error) => {
            console.error('❌ Mongoose connection error:', error);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ Mongoose disconnected');
        });
        
        return conn;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw error;
    }
};

/**
 * Gracefully close database connection
 */
const closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('📦 Database connection closed');
    } catch (error) {
        console.error('❌ Error closing database connection:', error.message);
    }
};

/**
 * Check database connection status
 */
const getConnectionStatus = () => {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    return {
        state: states[mongoose.connection.readyState],
        host: mongoose.connection.host,
        name: mongoose.connection.name
    };
};

module.exports = {
    connectDB,
    closeDB,
    getConnectionStatus
};
