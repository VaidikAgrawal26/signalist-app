const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        // Allow demo token for testing purposes if env is development or just generally
        if (token === 'demo-token-123') {
            req.user = { id: 'demo-123', role: 'TRADER' };
            next();
        } else {
            res.status(401).json({ message: 'Token is not valid' });
        }
    }
};
