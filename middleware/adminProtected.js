const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel/Admin');

// Middleware for protected routes
exports.protectedAdmin = asyncHandler(async (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. Token is missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const admin = await Admin.findById(decoded.id); // Get admin from the decoded token

        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized access. Admin not found.' });
        }
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden. Only admins can access this resource.' });
        }

        req.admin = admin; // Attach admin data to request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
});
