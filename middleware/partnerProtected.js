const jwt = require('jsonwebtoken');

const partnerProtected = (req, res, next) => {
    const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Decode the token and store the partner's mobile in req.partner
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.partner = decoded; // Assuming decoded contains the mobile number in the 'id' field
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = partnerProtected;
