const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies (preferred for security)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } 
    // Check for token in Authorization header (standard)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (excluding password)
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found, not authorized' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Invalid token, not authorized' });
    }
};

module.exports = { protect };
