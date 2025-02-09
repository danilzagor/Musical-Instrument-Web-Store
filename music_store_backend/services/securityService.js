const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

const authorizeRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }
    next();
};

const verifyUserId = (req, res, next) => {
    const userId = parseInt(req.user.id, 10);
    const paramId = parseInt(req.params.id, 10);

    if (userId !== paramId) {
        return res.status(403).json({ error: 'Forbidden: You cannot access this resource' });
    }

    next();
};


module.exports = {
    authenticateToken,
    authorizeRole,
    verifyUserId
}