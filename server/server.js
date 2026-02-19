const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Performance Middleware
app.use(compression());

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Connection function for Serverless
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    console.log('🔄 Connecting to MongoDB...');
    return mongoose.connect(process.env.MONGO_URI);
};

// Middleware to ensure DB connection before every request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'MovieVerse API is running 🎬',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`💥 Error: ${err.message}`);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? 'null' : err.stack,
    });
});

// Start server only if not running on Vercel (Local Dev)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on http://localhost:${PORT}`);
        connectDB();
    });
}

// CRITICAL: Export for Vercel
module.exports = app;

